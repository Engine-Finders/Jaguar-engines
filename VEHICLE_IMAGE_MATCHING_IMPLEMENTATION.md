# Registration lookup → quote form → matching vehicle picture

How enginefinders.co.uk turns a typed UK number plate into a vehicle picture on the quote form,
written so it can be re-implemented on another site. Everything below was read from the live
code (`asset/hero-logic.v2.js`, `form/form.html`, `vehicle-image.php`) on 2026-10-24, and the
PHP matcher was run locally against the real image library to confirm its behaviour.

> **Two versions of the matcher are described.** Section 4 is **v1**, the matcher that was live on
> enginefinders.co.uk when this was written. It is loose: it can show a wrong-brand picture.
> Section 7 is **v2**, a strict tiered matcher (brand must match, then model, variant, year) that was
> built and tested against the real image library on 2026-10-24. **Implement v2 on a new site.**

---

## 1. The idea in one paragraph

The reg-lookup API returns **text only** (make, model, year, engine size, fuel). It does **not**
return a picture. The site keeps its own library of car photos, and a small server-side script
(`vehicle-image.php`) picks the best photo by comparing the **words in the photo's filename**
with the make/model text from the API, then streams that file back. The quote form just puts
that script's URL in an `<img src>`.

```
visitor types reg
      │
      ▼
[1] browser JS  ──GET──►  checkcardetails API  ──►  { make, model, yearOfManufacture,
      (hero-logic.v2.js)                               engineCapacity, fuelType, ... }
      │
      │  redirect:  /form/form?vrm=..&year=..&brand={make}&series={model}
      │                       &engineCapacity=..&fuelType=..
      ▼
[2] quote form page (form.html) reads the URL, shows "Make – Series – Year",
      and sets  <img src="/vehicle-image.php?make=..&series=..&model=..&year=..">
      │
      ▼
[3] vehicle-image.php  scans asset/img/front-angle-view/*-45-angle-front-view.webp,
      scores every filename, streams the best one as image/webp (or 404 → form hides the box)
```

Nothing about the picture is stored in a database or a manifest. The folder **is** the index.

---

## 2. Step 1 – the registration lookup (browser JavaScript)

**Endpoint (GET):**
`https://api.checkcardetails.co.uk/vehicledata/vehicleregistration?apikey=<KEY>&vrm=<REG>`

**Fields the code reads from the JSON reply** (these five are the only ones the site uses):

| API field | used as |
|---|---|
| `make` | `brand` URL param, then the make words for image matching |
| `model` | `series` URL param (**yes, the API's `model` goes in the `series` slot**) |
| `yearOfManufacture` | `year` URL param |
| `engineCapacity` | `engineCapacity` URL param (stored on the lead) |
| `fuelType` | `fuelType` URL param (stored on the lead) |

**A real reply, captured 2026-10-24 for reg `YVB151H`** (HTTP 200, `application/json; charset=utf-8`).
This is the complete JSON, so these are all the fields the endpoint returned for that reg:

```json
{
  "registrationNumber": "YVB151H",
  "make": "ROVER",
  "model": "RANGE ROVER",
  "colour": "GREEN",
  "fuelType": "PETROL",
  "engineCapacity": 3528,
  "yearOfManufacture": 1970,
  "vehicleAge": "56 years 9 months",
  "wheelplan": "2 AXLE RIGID BODY",
  "dateOfLastV5CIssued": "2022-02-24",
  "registrationPlace": "Beverley",
  "tax": { "taxStatus": "Taxed", "taxDueDate": "2027-01-01", "days": "70" },
  "mot": { "motStatus": "Not valid", "motDueDate": "2019-08-31", "days": 2610 }
}
```

- **There is no image or picture field.** Everything is text.
- The site uses only `make`, `model`, `yearOfManufacture`, `engineCapacity` and `fuelType`.
  It ignores `colour`, `vehicleAge`, `wheelplan`, `dateOfLastV5CIssued`, `registrationPlace`,
  `tax` and `mot`.
- `make` is the DVLA-style name. For this old Range Rover it is `"ROVER"`, while the image
  library names files `land rover-range rover-...`, so the make words do not line up.
- `engineCapacity` is a number (cc), `yearOfManufacture` is a number, the rest are strings.
- Other vehicles may return more or fewer fields (for example some may omit `fuelType` or
  `engineCapacity`), so keep the `|| ''` fallbacks. Capture a couple more replies, such as a
  modern car, an electric car and a motorbike, before relying on the shape.

**What the matcher does with this exact reply** (ran the real `vehicle-image.php` locally with
`make=ROVER`, `series=RANGE ROVER`, `year=1970`): it streams
`land rover-range rover-l460-hse-suv-2022–-new-eiger grey-l460 hse-45-angle-front-view.webp`,
a 2022 grey Range Rover L460, for what is really a green 1970 car. Only the words "range rover"
matched, the make did not, and the +40 year bonus was not available. This is a good regression
test for any improved matcher: a 1970 Rover Range Rover should show a classic Range Rover image,
or no image, never a 2022 model.

> An older endpoint, `.../vehicledata/ukvehicledata?...`, returns a nested shape
> (`result.VehicleRegistration.Make`, `.Model`). Some legacy pages still use it. The current hero
> does not.

**Code (the live logic, simplified):**

```js
var lookupInFlight = false;

function handleVrmLookup(inputId, triggerEl) {
  if (lookupInFlight) return;                       // stops duplicate API calls on rapid clicks

  var vrm = (document.getElementById(inputId).value || '').trim().toUpperCase();
  if (!vrm) { alert('Please enter a vehicle registration number.'); return; }

  lookupInFlight = true;
  if (triggerEl) triggerEl.disabled = true;

  var apiUrl = 'https://api.checkcardetails.co.uk/vehicledata/vehicleregistration?apikey=' + KEY +
               '&vrm=' + encodeURIComponent(vrm);

  fetch(apiUrl)
    .then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.ok) return data;
        throw new Error(data.message || ('HTTP error! Status: ' + res.status));
      });
    })
    .then(function (r) {
      window.location.href = '/form/form' +
        '?vrm='            + encodeURIComponent(vrm) +
        '&year='           + encodeURIComponent(r.yearOfManufacture || '') +
        '&brand='          + encodeURIComponent(r.make || '') +
        '&series='         + encodeURIComponent(r.model || '') +
        '&engineCapacity=' + encodeURIComponent(r.engineCapacity || '') +
        '&fuelType='       + encodeURIComponent(r.fuelType || '');
    })
    .catch(function (e) { alert((e && e.message) || 'Please enter a valid UK registration number.'); })
    .finally(function () { lookupInFlight = false; if (triggerEl) triggerEl.disabled = false; });
}
```

Wire it to the button click **and** the Enter key in the reg input. The live site uses ids
`fetch-button` / `vehicle-input` (plus variants `…1`, `…2`, `…-hero2`). **Every id must be bound by
the script**, or that button does nothing (this exact gap broke 221 pages once).

> **Security:** the API key sits in client-side JS, so anyone can read and reuse it. On a new
> site, call the API from a small server-side endpoint instead, and have the browser call that.

---

## 3. Step 2 – the quote form reads the URL and requests the picture

The form reads these query parameters:

```js
const urlParams = new URLSearchParams(window.location.search);
let make   = urlParams.get("make")   || urlParams.get("brand") || "";
let series = urlParams.get("series") || "";
let model  = urlParams.get("model")  || "";   // only set by the manual make/model dropdown flow
const year = urlParams.get("year")   || "";
const vrm  = urlParams.get("vrm")    || urlParams.get("reg") || "";
const engine = urlParams.get("engine") || ""; // set by the engine-table "Get Quote" buttons
```

- **Reg flow:** `make` = API make, `series` = API model, `model` = empty.
- **Manual dropdown flow:** `series` and `model` both come from the dropdowns.
- The form tidies `series` (removes a leading make word, e.g. "Range Rover Defender" → "Defender")
  and shows a heading such as `Alfa Romeo – 145 – 1999`.

It then requests the picture (only if it has a series or model):

```js
const hasVehicleDetails = Boolean(cleanSeries || cleanModel);
if (vehicleImage && vehicleImageWrapper && hasVehicleDetails) {
  const imageUrl = new URL("../vehicle-image.php", window.location.href);
  imageUrl.search = new URLSearchParams({ make, series: cleanSeries, model: cleanModel, year }).toString();
  vehicleImage.alt = [make, cleanSeries || cleanModel].filter(Boolean).join(" ") + " vehicle";
  vehicleImage.addEventListener("load",  () => { vehicleImageWrapper.style.display = "block"; });
  vehicleImage.addEventListener("error", () => { vehicleImageWrapper.style.display = "none";  });
  vehicleImage.src = imageUrl.toString();
}
```

The picture box stays hidden until the image actually loads, so a 404 simply shows no picture.

Hidden fields posted with the lead: `vehicle_brand`, `vehicle_series`, `vehicle_model`, `vehicle_reg`
(holds the year), `vehicle_vrm`, `engine_code`, `engin_capacity`, `fuelType`, `source_page`.

---

## 4. Step 3 – `vehicle-image.php`, v1 (the matcher that was live)

```php
<?php
declare(strict_types=1);

function vehicle_image_terms(string $value): array
{
    $nonIdentityTerms = [
        'petrol','diesel','hybrid','electric','mhev','phev','hev','lpg','cng','biofuel','ethanol',
        'automatic','manual','auto','cvt','awd','fwd','rwd','4wd','2wd','hatchback','estate',
        'saloon','suv','coupe','convertible','roadster','mpv','van','pickup','door','doors',
        'special','standard','new'
    ];
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?? '';
    $terms = array_filter(explode(' ', trim($value)));
    return array_values(array_unique(array_diff($terms, $nonIdentityTerms)));
}

function vehicle_image_score(array $fileTerms, array $makeTerms, array $seriesTerms,
                             array $modelTerms, ?int $year, string $filename): int
{
    $score = 0; $identityMatches = 0;
    foreach ($makeTerms   as $t) if (in_array($t, $fileTerms, true)) { $score += 2; }
    foreach ($seriesTerms as $t) if (in_array($t, $fileTerms, true)) { $score += 10; $identityMatches++; }
    foreach ($modelTerms  as $t) if (in_array($t, $fileTerms, true)) { $score += 8;  $identityMatches++; }
    if ($identityMatches === 0) return 0;

    if ($year !== null && preg_match_all('/(?:19|20)\d{2}/', $filename, $m)) {
        $years = array_map('intval', $m[0]);
        if ($year >= min($years) && $year <= max($years)) $score += 40;
    }
    return $score;
}

$make   = (string)($_GET['make'] ?? $_GET['brand'] ?? '');
$series = (string)($_GET['series'] ?? '');
$model  = (string)($_GET['model'] ?? '');
$year   = isset($_GET['year']) && preg_match('/^(?:19|20)\d{2}$/', (string)$_GET['year'])
        ? (int)$_GET['year'] : null;

$seriesTerms = vehicle_image_terms($series);
$modelTerms  = vehicle_image_terms($model);
$makeTerms   = vehicle_image_terms($make);
if (!$seriesTerms && !$modelTerms) { http_response_code(404); exit; }

$files = glob(__DIR__ . '/asset/img/front-angle-view/*-45-angle-front-view.webp') ?: [];
$best = null; $bestScore = 0;
foreach ($files as $path) {
    $name  = basename($path);
    $score = vehicle_image_score(vehicle_image_terms(pathinfo($name, PATHINFO_FILENAME)),
                                 $makeTerms, $seriesTerms, $modelTerms, $year, $name);
    if ($score > $bestScore) { $best = $path; $bestScore = $score; }   // first file wins ties
}
if ($best === null) { http_response_code(404); exit; }

header('Content-Type: image/webp');
header('Cache-Control: public, max-age=86400');
header('Content-Length: ' . (string)filesize($best));
readfile($best);
```

**Scoring summary**

| match | points |
|---|---|
| each series word found in the filename | +10 |
| each model word found in the filename | +8 |
| each make word found in the filename | +2 |
| the vehicle's year lies between the lowest and highest 4-digit year in the filename | +40 |
| no series/model word matched at all | score 0 → never chosen |

Words like petrol, diesel, automatic, hatchback, coupe, door(s), special, standard, new are ignored.
Highest score wins; on a tie the first file in `glob()` order wins. The file is sent as-is
(no resizing).

---

## 5. The image library

- Folder: `asset/img/front-angle-view/`, URLs like `/asset/img/front-angle-view/<name>.webp`.
- Each car has up to four photos: `-45-angle-front-view`, `-front-view`, `-back-view`, `-flat-side-view`.
  **Only `*-45-angle-front-view.webp` is used by the matcher** (423 of 957 files on the live site).
- Filenames carry the words the matcher compares, in this rough pattern:
  `{make}-{model/generation code}-{variant}-{body}-{year range}-{colour/extras}-45-angle-front-view.webp`
  e.g. `audi-a3-8v gen 3-a3 3-door-3-door hatch-2012-2016-2014-new-audi-a3-8v-3dr-45-angle-front-view.webp`
- So **the filename is the data**. Name files carefully: include the make, the model words people
  will see in the API's `model` string, and the production years (they drive the +40 year bonus).
- The make-and-model picker on the site uses separate hard-coded paths in `data/models/*.json`
  (268 references). The reg flow does not use those.
- Names are long and contain characters such as the en dash (–). On Windows this hits the
  260-character path limit when copying or unzipping. Use a long-path-aware tool, keep names
  shorter, or avoid very long folder paths.

---

## 6. Known weaknesses of v1 (measured with the real script)

Inputs below are illustrative, not real API values:

| make, series, year | picture chosen | problem |
|---|---|---|
| BMW, `320D`, 2015 | BMW **G20** 320d (2019–2022) | wrong generation (only 320d image available) |
| BMW, `3 SERIES`, 2015 | an **Audi A1 3-door** | the word "3" matches "3-door"; make is not required |
| Mercedes-Benz, `A CLASS`, 2019 | a Mercedes **S-Class** | "class" matches "s-class" and the year bonus decides |
| Audi, `A3`, 2016 | Audi A3 8V (2012–2016) | correct |

Root causes: the make is never required, single-character or numeric words match anything,
year is only a bonus, and ties are decided by file order.

---

## 7. v2 – the strict tiered matcher (recommended; built and tested 2026-10-24)

### The rules

1. **Make / brand must match.** If it does not, or the brand has no photo in the library, return
   nothing (HTTP 404) and the form hides the picture box. No make at all also returns nothing.
2. **Within that brand, rank by:** the same **model** first, then the same **variant**, then the
   **year** (in range, otherwise the closest range).
3. **If the model is not in the library, fall back to any photo of that brand** (closest year).
   The response header `X-Vehicle-Image-Tier` is `model` or `brand` so you can see which rule fired.

How it achieves that (all in the code below):

- **Brand keys** are normalised, with aliases: mercedes / merc / mercedes-benz, vw / volkswagen,
  land rover / range rover, and an API make of `ROVER` counts as Land Rover when the model says
  range rover, discovery, defender or freelander. Image files get their brand from the first part of
  the file name. Mercedes files that start with the model (`a-class-…`, `amg gt-…`, `cls-…`) are
  mapped to Mercedes with a fixed list, **so name new files with the brand first**.
- **Model match** = the input's model words, starting from the FIRST word, must appear back-to-back
  in the file name ("3 series", "a class", "320d"). A lone single character ("3", "a") is not a
  model. This stops "3 series" matching an Audi "3-door" and "a class" matching "s-class".
- **Alternatives** for how the API writes the model versus how files are named: Mercedes
  `A 180 D` / `C220` → `a class` / `c class`, `GLC 220 D` → `glc`; BMW `330I` → `3 series`.
- **Variant** = extra input words (e.g. "sportback", "m sport") also found in the file name.
- **Year**: in range beats out of range, then the smaller gap wins. A name like `2022–` is treated as
  "still in production". It never overrides model or variant.

### The code (drop in as `vehicle-image.php` in the site root, next to `asset/`)

```php
<?php
declare(strict_types=1);

/**
 * Picks the closest front-angle vehicle photo for the registration details returned by the
 * vehicle API, then streams the chosen WebP.
 *
 * Priority (strict):
 *   1. MAKE / BRAND must match. If the brand has no photo at all, nothing is returned (404).
 *   2. Within that brand, prefer the same MODEL, then the same VARIANT, then the closest YEAR.
 *   3. If the model is not in the library, fall back to any photo of the brand (closest year).
 *
 * Only *-45-angle-front-view.webp files are considered. The X-Vehicle-Image-Tier header says
 * which rule produced the picture ("model" or "brand").
 */

const VI_NON_IDENTITY = [
    'petrol', 'diesel', 'hybrid', 'electric', 'mhev', 'phev', 'hev',
    'lpg', 'cng', 'biofuel', 'ethanol', 'automatic', 'manual', 'auto',
    'cvt', 'awd', 'fwd', 'rwd', '4wd', '2wd', 'hatchback', 'estate',
    'saloon', 'suv', 'coupe', 'convertible', 'roadster', 'mpv', 'van',
    'pickup', 'door', 'doors', 'special', 'standard', 'new',
];

// Mercedes files that start with the model name instead of "mercedes-benz-".
const VI_MERCEDES_BRANDLESS = [
    'a', 'b', 'c', 'e', 'g', 's', 'v', 'x', 'cla', 'clb', 'clc', 'clk', 'cls', 'gla', 'glb',
    'glc', 'gle', 'gls', 'sl', 'slc', 'slk', 'citan', 'vito', 'amggt', 'sprinter',
    'eqa', 'eqb', 'eqc', 'eqe', 'eqs', 'eqv',
];

/** Lower-case word list, order kept, with non-identity words (petrol, automatic ...) removed. */
function vi_tokens(string $value): array
{
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?? '';
    $parts = array_values(array_filter(explode(' ', trim($value)), static fn ($x) => $x !== ''));
    return array_values(array_diff($parts, VI_NON_IDENTITY));
}

/** Normalises the make from the API / form into the brand key used for files. */
function vi_brand_key(string $make, string $series): string
{
    $k = preg_replace('/[^a-z0-9]/', '', strtolower($make)) ?? '';
    if ($k === '') {
        return '';
    }
    $aliases = [
        'mercedes' => 'mercedesbenz', 'merc' => 'mercedesbenz', 'mercedesbenz' => 'mercedesbenz',
        'vw' => 'volkswagen',
        'landrover' => 'landrover', 'rangerover' => 'landrover',
    ];
    if (isset($aliases[$k])) {
        return $aliases[$k];
    }
    // Old Range Rovers / Discoverys / Defenders are registered under the make "ROVER".
    if ($k === 'rover' && preg_match('/range\s*rover|discovery|defender|freelander/i', $series)) {
        return 'landrover';
    }
    return $k;
}

/** Brand key of an image file, from the first part of its name. */
function vi_file_brand(string $filename): string
{
    $first = explode('-', $filename, 2)[0];
    $k = preg_replace('/[^a-z0-9]/', '', strtolower($first)) ?? '';
    if ($k === 'landrover' || $k === 'rangerover') {
        return 'landrover';
    }
    if ($k === 'mercedes' || $k === 'mercedesbenz' || in_array($k, VI_MERCEDES_BRANDLESS, true)) {
        return 'mercedesbenz';
    }
    return $k;
}

/** Words of a file name that describe the car (brand prefix and the "45 angle front view" suffix removed). */
function vi_file_tokens(string $filename): array
{
    $name = preg_replace('/\.webp$/i', '', $filename) ?? $filename;
    $name = preg_replace('/-45-angle-front-view$/i', '', $name) ?? $name;
    $tokens = vi_tokens($name);
    $first = preg_replace('/[^a-z0-9]/', '', strtolower(explode('-', $filename, 2)[0])) ?? '';
    if ($first === 'landrover' && array_slice($tokens, 0, 2) === ['land', 'rover']) {
        $tokens = array_slice($tokens, 2);
    } elseif (($first === 'mercedes' || $first === 'mercedesbenz') && ($tokens[0] ?? '') === 'mercedes') {
        $tokens = array_slice($tokens, ($tokens[1] ?? '') === 'benz' ? 2 : 1);
    }
    return $tokens;
}

/** [firstYear, lastYear, openEnded] found in the file name, or null. */
function vi_year_range(string $filename): ?array
{
    if (!preg_match_all('/(?:19|20)\d{2}/', $filename, $m) || !$m[0]) {
        return null;
    }
    $years = array_map('intval', $m[0]);
    $first = min($years);
    $last = max($years);
    if (preg_match('/((?:19|20)\d{2})\x{2013}(?!\d)/u', $filename)) {   // "2022–" = still in production
        $last = max($last, (int) date('Y'));
    }
    return [$first, $last];
}

/** Length of the longest run of the input words, STARTING AT THE FIRST WORD, found back-to-back in the file words. */
function vi_run_length(array $input, array $file): int
{
    $n = count($input);
    for ($len = $n; $len >= 1; $len--) {
        $run = array_slice($input, 0, $len);
        if (strlen(implode('', $run)) < 2) {      // a lone "3" or "a" is not a model
            continue;
        }
        for ($i = 0, $max = count($file) - $len; $i <= $max; $i++) {
            if (array_slice($file, $i, $len) === $run) {
                return $len;
            }
        }
    }
    return 0;
}

/** Alternative ways the same model is written (API says "A 180 D", files say "a class"). */
function vi_alternatives(string $brand, array $tokens): array
{
    $alts = [];
    $t0 = $tokens[0] ?? '';
    if ($brand === 'mercedesbenz' && $t0 !== '') {
        if (preg_match('/^(a|b|c|e|g|s|v|x)\d{2,3}[a-z]*$/', $t0, $m)) {
            $alts[] = [$m[1], 'class'];
        } elseif (preg_match('/^(a|b|c|e|g|s|v|x)$/', $t0) && isset($tokens[1]) && preg_match('/^\d{2,3}/', $tokens[1])) {
            $alts[] = [$t0, 'class'];
        } elseif (preg_match('/^(gla|glb|glc|gle|gls|cla|clb|cls|clk|slk|slc|sl)\d{0,3}[a-z]*$/', $t0, $m)) {
            $alts[] = [$m[1]];
        }
    }
    if ($brand === 'bmw' && preg_match('/^([1-8])\d{2}[a-z]{0,2}$/', $t0, $m)) {
        $alts[] = [$m[1], 'series'];
    }
    return $alts;
}

/**
 * Chooses a photo. Returns [path, tier] with tier "model" or "brand", or null for "show nothing".
 *
 * @param string[] $files absolute paths of the *-45-angle-front-view.webp files
 */
function vi_pick(string $make, string $series, string $model, ?int $year, array $files): ?array
{
    $brand = vi_brand_key($make, $series);
    if ($brand === '') {
        return null;                                     // rule 1: no make, no picture
    }

    $brandFiles = [];
    foreach ($files as $path) {
        $name = basename($path);
        if (vi_file_brand($name) === $brand) {
            $brandFiles[] = $path;
        }
    }
    if (!$brandFiles) {
        return null;                                     // rule 1: brand not in the library
    }

    $seriesTokens = vi_tokens($series);
    $modelTokens = vi_tokens($model);
    foreach ([&$seriesTokens, &$modelTokens] as &$list) {   // drop a leading copy of the make
        $makeTokens = vi_tokens($make);
        if ($makeTokens && array_slice($list, 0, count($makeTokens)) === $makeTokens && count($list) > count($makeTokens)) {
            $list = array_slice($list, count($makeTokens));
        }
    }
    unset($list);

    $seriesAlts = vi_alternatives($brand, $seriesTokens);
    $modelAlts = vi_alternatives($brand, $modelTokens);
    $matchedRows = [];
    $allRows = [];

    foreach ($brandFiles as $path) {
        $name = basename($path);
        $fileTokens = vi_file_tokens($name);

        $score = 0;
        $used = [];
        foreach ([[$seriesTokens, $seriesAlts, 10], [$modelTokens, $modelAlts, 8]] as [$tokens, $alts, $weight]) {
            if (!$tokens) {
                continue;
            }
            $run = vi_run_length($tokens, $fileTokens);
            if ($run > 0) {
                $score += $run * $weight * 3;
                $used = array_merge($used, array_slice($tokens, 0, $run));
                continue;
            }
            foreach ($alts as $alt) {
                $altRun = vi_run_length($alt, $fileTokens);
                if ($altRun === count($alt)) {
                    $score += $altRun * $weight;
                    $used = array_merge($used, $alt);
                    break;
                }
            }
        }

        $variant = 0;
        if ($score > 0) {
            foreach (array_merge($seriesTokens, $modelTokens) as $t) {
                if (!in_array($t, $used, true) && (strlen($t) >= 2 || ctype_digit($t)) && in_array($t, $fileTokens, true)) {
                    $variant++;
                }
            }
        }

        $range = vi_year_range($name);
        $inRange = 0;
        $gap = 0;
        if ($year !== null && $range !== null) {
            if ($year >= $range[0] && $year <= $range[1]) {
                $inRange = 1;
            } else {
                $gap = min(abs($year - $range[0]), abs($year - $range[1]));
            }
        } elseif ($year !== null) {
            $gap = 999;                                  // no year in the file name: least preferred
        }

        $row = ['path' => $path, 'name' => $name, 'score' => $score, 'variant' => $variant, 'inRange' => $inRange, 'gap' => $gap];
        $allRows[] = $row;
        if ($score > 0) {
            $matchedRows[] = $row;
        }
    }

    $tier = 'model';
    $rows = $matchedRows;
    if (!$rows) {                                        // rule 3: brand only
        $tier = 'brand';
        $rows = $allRows;
    }

    usort($rows, static function (array $a, array $b) use ($tier): int {
        if ($tier === 'model') {
            if ($a['score'] !== $b['score']) {
                return $b['score'] <=> $a['score'];      // model first
            }
            if ($a['variant'] !== $b['variant']) {
                return $b['variant'] <=> $a['variant'];  // then variant
            }
        }
        if ($a['inRange'] !== $b['inRange']) {
            return $b['inRange'] <=> $a['inRange'];      // then year
        }
        if ($a['gap'] !== $b['gap']) {
            return $a['gap'] <=> $b['gap'];
        }
        return strcmp($a['name'], $b['name']);
    });

    return [$rows[0]['path'], $tier];
}

if (!defined('VEHICLE_IMAGE_NO_RUN')) {
    $param = static function (string ...$keys): string {
        foreach ($keys as $key) {
            if (isset($_GET[$key]) && is_string($_GET[$key]) && $_GET[$key] !== '') {
                return substr($_GET[$key], 0, 120);
            }
        }
        return '';
    };

    $make = $param('make', 'brand');
    $series = $param('series');
    $model = $param('model');
    $yearParam = $param('year');
    $year = preg_match('/^(?:19|20)\d{2}$/', $yearParam) ? (int) $yearParam : null;

    $imageDirectory = defined('VI_IMAGE_DIR') ? VI_IMAGE_DIR : __DIR__ . '/asset/img/front-angle-view';
    $files = glob($imageDirectory . '/*-45-angle-front-view.webp') ?: [];
    $pick = vi_pick($make, $series, $model, $year, $files);

    if ($pick === null) {
        http_response_code(404);
        exit;
    }

    [$bestImage, $tier] = $pick;
    header('Content-Type: image/webp');
    header('Cache-Control: public, max-age=86400');
    header('X-Vehicle-Image-Tier: ' . $tier);
    header('Content-Length: ' . (string) filesize($bestImage));
    readfile($bestImage);
}
```

### Tested behaviour (real library: 423 front-angle photos, 15 brands)

| make, series, year | result |
|---|---|
| ROVER, `RANGE ROVER`, 1970 | Land Rover Range Rover P38 (1994–2002), the oldest Range Rover in the library |
| BMW, `3 SERIES`, 2015 | BMW 3 Series (before: an Audi A1) |
| BMW, `330I`, 2018 | BMW 3 Series, via the alternative `3 series` |
| MERCEDES-BENZ, `A CLASS` / `A 180 D SE`, 2019 | A-Class (before: an S-Class) |
| AUDI, `A3 SPORTBACK`, 2019 | Audi A3 8Y Sportback (variant matched) |
| BMW, `ZZZ UNKNOWN`, 2015 | a BMW, closest year (brand-only tier) |
| FORD, `ZZZ`, 2018 | a Ford (brand-only tier) |
| NISSAN `QASHQAI`, PEUGEOT `208`, ALFA ROMEO `147`, MG `ZS` | **no picture** (brand not in library) |
| no make, `GOLF` | **no picture** |

Bulk test: one synthetic lookup per photo (make + first model words + a year inside its range),
423 queries. Wrong-brand pictures: **1 with v1, 0 with v2.** The exact photo returned: 334 with v1,
353 with v2. 19 lookups fell back to the brand-only tier.

### Known limits of v2

- **It cannot tell close model lines apart.** `DISCOVERY 4` returns a Discovery Sport (same brand
  and family). Fix it by adding the missing photos, or by adding a model alias.
- **Brands not in the library show no picture.** That is by design. Add photos to extend coverage.
- Filenames are the data. If a photo's name lacks the brand or the model words, it will not match.
- `glob()` and scoring run on every request. At about 400 photos this is fine. Past a few thousand,
  build a cached index of file tokens and year ranges.
- A cheap request-level cache header is already sent (`max-age=86400`), so after deploying a new
  version, purge the CDN or wait a day.

### Other recommendations

- **Keep the API key on the server** and expose a server endpoint to the browser.
- **Log 404s and brand-only fallbacks** (make and series) so missing photos can be added.
- Capture more real API replies (modern car, electric car, motorbike) and add them to the tests.

---

## 8. Checklist for a new site

- [ ] API access: key, one saved real response, and a server-side proxy if possible.
- [ ] Reg input + button with **every id bound** in JS, a double-click guard, Enter-key support and
      a clear error message for invalid regs.
- [ ] Redirect (or ajax) to the quote form with `vrm, year, brand, series, engineCapacity, fuelType`.
- [ ] Quote form reads those parameters, shows "Make – Series – Year", fills hidden fields
      (including engine/capacity/fuel) and posts them with the lead.
- [ ] Image library in one folder with consistent, descriptive filenames and only one photo type
      per car for the matcher.
- [ ] `vehicle-image.php` (or equivalent) implementing **v2** from section 7; picture box hidden on 404.
- [ ] Test script (below), a real-browser test, and a CDN purge after deploying.

**Local test (PHP CLI)** – prints which file the script picks for given inputs:

```php
<?php
// php imgtest.php MAKE SERIES YEAR
$root = __DIR__;                                   // site root containing vehicle-image.php
$_GET = ['make' => $argv[1] ?? '', 'series' => $argv[2] ?? '', 'model' => '', 'year' => $argv[3] ?? ''];
$byMd5 = [];
foreach (glob($root . '/asset/img/front-angle-view/*-45-angle-front-view.webp') as $f) {
    $byMd5[md5_file($f)][] = basename($f);
}
ob_start(); include $root . '/vehicle-image.php'; $out = ob_get_clean();
echo ($out === '' || $out === false) ? "NO IMAGE (404)\n" : ($byMd5[md5($out)][0] ?? '(unknown)') . "\n";
```

Run each case in its own process (the script declares functions, so it cannot be included twice
in one run). A 404 case calls `exit`, so it prints nothing in this harness.
