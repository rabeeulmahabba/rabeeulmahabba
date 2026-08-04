/* ============================================================
   RABEEUL MAHABBA — data.js
   All site configuration lives here. Non-developers (madrasa
   committee) only ever need to touch THIS file + the Google Sheet.
   ============================================================ */

const CONFIG = {

  // ---- Fest basics ----
  festName: "RABEEUL MAHABBA",
  madrasaName: "Bafaqhi Thangal Memorial Madrasa, Koyilandy",
  festDate: "2026-08-23T08:00:00",   // countdown target (ISO format)

  // ---- Hero slider slides ----
  // `image` is the background photo path (relative to index.html).
  // Slide 1 uses the official fest poster — its overlay text is
  // hidden automatically in script.js/style.css since the poster
  // already carries its own title & date design.
  heroSlides: [
    {
      kicker: "Meelad Fest 2026",
      title: "RABEEUL MAHABBA",
      subtitle: "a celebration of love for the Prophet ﷺ",
      image: "images/hero-poster.jpg"
    },
    {
      kicker: "60+ ഇനങ്ങൾ",
      title: "മത്സര വേദി ഒരുങ്ങുന്നു",
      subtitle: "കിഡ്സ് മുതൽ സീനിയർ വരെ എല്ലാ വിഭാഗങ്ങളും",
      image: null
    },
    {
      kicker: "ഓഗസ്റ്റ് 23 – 31",
      title: "എല്ലാവരെയും സ്വാഗതം ചെയ്യുന്നു",
      subtitle: "കുടുംബമായി, കൂട്ടുകാരുമായി ഒരുമിച്ചു ചേരൂ",
      image: null
    }
  ],

  // ---- Google Sheet: LIVE RESULTS ----
  // 1. Create a Google Sheet with this header row (exact order):
  //    Category | Gender | Type | Event | First | Second | Third
  //    Category values: kiddies / subjunior / junior / senior / general
  //    Gender values:   Boys / Girls
  //    Type values:     Stage / Off Stage
  // 2. File → Share → Publish to web → choose this sheet → CSV → Publish
  // 3. Paste the CSV link below between the quotes.
  // Leave it empty ("") to use the sample data in FALLBACK_RESULTS below.
  resultsSheetCsvUrl: "",

  // Used only when resultsSheetCsvUrl is empty, or the fetch fails —
  // so the page always has something to show while you're setting up.
  fallbackResults: [
    {cat:'kiddies', gender:'Boys', type:'Stage', name:'കഥാകഥനം', first:'', second:'', third:''},
    {cat:'kiddies', gender:'Boys', type:'Stage', name:'സംഘ ഗാനം', first:'', second:'', third:''},
    {cat:'kiddies', gender:'Girls', type:'Stage', name:'ഗാനം', first:'', second:'', third:''},
    {cat:'subjunior', gender:'Boys', type:'Off Stage', name:'സ്പെല്ലിങ് ബീ', first:'', second:'', third:''},
    {cat:'junior', gender:'Girls', type:'Stage', name:'മാലപ്പാട്ട് (മുഹ്യുദ്ദീൻ മാല)', first:'', second:'', third:''},
    {cat:'senior', gender:'Boys', type:'Stage', name:'മദ്ഹ് ഗാനം', first:'', second:'', third:''},
    {cat:'general', gender:'Boys', type:'Stage', name:'ബുർദ', first:'', second:'', third:''},
  ],

  catLabels: { kiddies:'കിഡ്സ്', subjunior:'സബ് ജൂനിയർ', junior:'ജൂനിയർ', senior:'സീനിയർ', general:'ജനറൽ' }
};
