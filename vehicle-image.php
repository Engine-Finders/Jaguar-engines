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
