/* ============================================================
   JAGUAR RELIABILITY INDEX 2026 — CHART CONFIGURATIONS
   Chart.js loaded via CDN in page <head>. This file holds only
   this report's chart configs, lives in assets/jaguar/.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return;

  Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.color = "#5C5C61";

  var RED = "#9E1B32", BLACK = "#101012", SILVER = "#A8A8AD", REDLIGHT = "#C24A5E";

  var scoreCtx = document.getElementById("engineScoreChart");
  if (scoreCtx) {
    new Chart(scoreCtx, {
      type: "bar",
      data: {
        labels: ["AJ200P / 204PT", "AJ200D / 204DTD", "AJ126", "AJ133 / 508PN"],
        datasets: [{
          label: "Engine Score (out of 100)",
          data: [82, 74, 72, 66],
          backgroundColor: [RED, BLACK, SILVER, SILVER],
          borderRadius: 4, maxBarThickness: 46
        }]
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 100, grid: { color: "#EFEEEE" } }, y: { grid: { display: false } } }
      }
    });
  }

  var radarCtx = document.getElementById("dimensionRadarChart");
  if (radarCtx) {
    new Chart(radarCtx, {
      type: "radar",
      data: {
        labels: ["Reliability", "Repair Cost", "Repairability", "Parts Supply", "Replacement Economics"],
        datasets: [
          { label: "AJ200P (82/100)", data: [18,16,12,20,16], borderColor: RED, backgroundColor: "rgba(158,27,50,0.13)", pointBackgroundColor: RED },
          { label: "AJ133 (66/100)", data: [14,8,12,16,16], borderColor: SILVER, backgroundColor: "rgba(168,168,173,0.15)", pointBackgroundColor: "#8a8a8f" }
        ]
      },
      options: {
        scales: { r: { min: 0, max: 20, ticks: { stepSize: 5, backdropColor: "transparent" }, grid: { color: "#EFEEEE" }, pointLabels: { font: { size: 11 } } } },
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  var volumeCtx = document.getElementById("enquiryVolumeChart");
  if (volumeCtx) {
    new Chart(volumeCtx, {
      type: "bar",
      data: {
        labels: ["AJ200D / 204DTD", "AJ126", "AJ200P / 204PT", "AJ133 / 508PN"],
        datasets: [{ label: "2025 UK Enquiries", data: [590, 560, 500, 330], backgroundColor: BLACK, borderRadius: 4, maxBarThickness: 50 }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: "#EFEEEE" } }, x: { grid: { display: false } } }
      }
    });
  }

  var modelCtx = document.getElementById("modelDemandChart");
  if (modelCtx) {
    new Chart(modelCtx, {
      type: "bar",
      data: {
        labels: ["XF X260","XE X760","F-Pace X761","XJ X351","E-Pace X540","X-Type X400","S-Type X200","F-Type X152"],
        datasets: [{ label: "2025 Engine Replacement Enquiries by Model", data: [276,260,220,151,140,120,70,53], backgroundColor: RED, borderRadius: 4 }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: "#EFEEEE" } }, x: { grid: { display: false }, ticks: { font: { size: 10.5 } } } }
      }
    });
  }
});
