import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PreventivoForm from './PreventivoForm';

const defaulData = {
  "pages": [{
    "id": "1", "title": "BRAND IDENTITY & BRAND PROTECTION", "state": false, "parents": [], "items": [{ "id": "d39fab38-a930-469f-a646-51536259fa3a", "type": "paragrafo", "title": "Paragrafo", "content": "<p>Restyling della Brand del marchio “ELLEDI”.</p>" }, { "id": "bf586477-9434-443f-9067-fad08c7f5b42", "type": "title", "title": "Title", "content": "<p>Logo</p>" }, { "id": "63be42c8-b278-48bb-ac58-64218dc4c5b0", "type": "elenco", "title": "Elenco", "content": [{ "id": 1684854750482, "text": "<p><strong>Restyling</strong> grafico del logotipo attraverso più proposte creative (almeno 3)</p>" }, { "id": 1684854763733, "text": "Definizione e ingegnerizzazione del logo selezionato." }, { "id": 1687337527939, "text": "<p>assas</p>" }, { "id": 1688399312240, "text": "zxcxzczxc" }] }, { "id": "70c8ce02-e1a7-4b3b-879c-87fa4030abfe", "type": "title", "title": "Title", "content": "Title" }, { "id": "e73824ac-3758-46a4-b05d-1f1b7a25b7bc", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "<p>uihiasdhiaud</p>" }, { "id": 2, "text": "<p>s Ipsum è un testo segnaposto utilizzato nel settore</p>" }, { "id": 1687337545684, "text": "fgdfgdf" }] }, { "id": "cb6c5291-e392-4670-8ba9-b7a6eaf55308", "type": "title", "title": "Title", "content": "<p>Brand Book</p>" }, { "id": "42135a59-8c5c-426f-9250-a67c9fd1b79e", "type": "elenco", "title": "Elenco", "content": [{ "id": 2, "text": "<p><strong>Definizione</strong> ed <em>elaborazione</em> Manuale del logo e linee guida del marchio (versioni, colori principali, applicazioni, usi impropri, ecc..)</p>" }, { "id": 1, "text": "Definizione ed elaborazione della grafica coordinata con proposte layout grafici di stampa (insegne, bdv, brochure, folder, ecc...)" }] }, {
      "id": "59354cd2-f151-4980-b425-7d0c62c16b6f", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, { "id": "dbfcb9f3-9c7e-4fcf-94c3-4131b5e1c6c3", "type": "title", "title": "Title", "content": "<p>Registrazione marchio</p>" }, { "id": "38c824b2-1a73-4167-a414-246ea1b346c2", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "Attività di ricerca anteriorità e/o marchi affini per evitare contenziosi." }, { "id": 2, "text": "Registrazione del marchio \"ELLEDI\" a livello nazionale N°02 varianti (a colori e bianco e nero) su 1 classe di Nizza." }] }, {
      "id": "cdd8c423-d0de-4565-8678-736ed6ef6f3e", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, { "id": "b1c5687b-782e-4240-860c-bdd911ed6fd8", "type": "paragrafo", "title": "Paragrafo", "content": "<p>Classi di Nizza ulteriori:&nbsp;</p>" }, {
      "id": "0876ef66-0dd9-467e-89ac-af2dffa5d9b1", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, {
      "id": "3426fb61-3eaa-4542-9aac-a95089015a62", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }]
  }, { "id": "2", "title": "SITO WEB: SVILUPPO & ASSISTENZA TECNICA", "items": [{ "id": "0d325e90-a32a-400c-ae91-05cd33c426f6", "type": "title", "title": "Title", "content": "Title" }, { "id": "304ab44f-a26e-497f-bc7f-e4ce5144ab53", "type": "paragrafo", "title": "Paragrafo", "content": "<p>Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipogrvvafia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dalfdfgdfffvv</p>" }], "state": true, "parents": ["3", "4"] }, { "id": "3", "title": "SEO", "subtitle": "Search Engine Optimization", "items": [{ "id": "51f7dad9-d59d-4e4f-93f2-5ad1e616a1ef", "type": "title", "title": "Title", "content": "Title" }, { "id": "4cb0dd0b-c9c6-4cb5-8052-38afa7e189cd", "type": "paragrafo", "title": "Paragrafo", "content": "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal" }, { "id": "1cc80b4f-2c12-4faa-9c2d-bc2a14f55aee", "type": "title", "title": "Title", "content": "Title" }, { "id": "f01d7b17-1692-4a79-b547-7c105ff86b76", "type": "paragrafo", "title": "Paragrafo", "content": "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal" }, { "id": "5a12456f-d489-4228-97f2-2803ae881fb4", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa" }, { "id": 2, "text": "Lorem Ipsum è un testo segnaposto utilizzato nel settore" }] }], "state": true, "parents": [] }, { "id": "4", "title": "SEM", "subtitle": "Search Engine Marketing", "items": [{ "id": "2a81b145-b4bc-41a6-adf3-e532206f2dca", "type": "title", "title": "Title", "content": "Title" }, { "id": "b84650a0-1ba7-4e18-ad08-db9df265a949", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa" }, { "id": 2, "text": "Lorem Ipsum è un testo segnaposto utilizzato nel settore" }] }], "state": true, "parents": [] }, { "id": "5", "title": "DEM", "subtitle": "Direct Email Marketing", "items": [{ "id": "3c25930a-4aa7-401a-8946-a14255cf78dd", "type": "title", "title": "Title", "content": "Title" }], "state": false, "parents": [] }, { "id": "6", "title": "SOCIAL", "subtitle": "NETWORK", "items": [], "state": false, "parents": [] }], "sidebar": {
    "id": "sidebar", "items": [{ "id": "8", "type": "title", "title": "Title", "content": "Title" }, { "id": "16", "type": "paragrafo", "title": "Paragrafo", "content": "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal" }, { "id": "17", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa" }, { "id": 2, "text": "Lorem Ipsum è un testo segnaposto utilizzato nel settore" }] }, {
      "id": "18", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, { "id": "14", "type": "gallery", "title": "Carousel", "content": "Carousel" }, { "id": "15", "type": "form", "title": "Form", "content": "Form" }]
  }, "pageArea": {
    "id": "1", "title": "BRAND IDENTITY & BRAND PROTECTION", "state": false, "parents": [], "items": [{ "id": "d39fab38-a930-469f-a646-51536259fa3a", "type": "paragrafo", "title": "Paragrafo", "content": "<p>Restyling della Brand del marchio “ELLEDI”.</p>" }, { "id": "bf586477-9434-443f-9067-fad08c7f5b42", "type": "title", "title": "Title", "content": "<p>Logo</p>" }, { "id": "63be42c8-b278-48bb-ac58-64218dc4c5b0", "type": "elenco", "title": "Elenco", "content": [{ "id": 1684854750482, "text": "<p><strong>Restyling</strong> grafico del logotipo attraverso più proposte creative (almeno 3)</p>" }, { "id": 1684854763733, "text": "Definizione e ingegnerizzazione del logo selezionato." }, { "id": 1687337527939, "text": "<p>assas</p>" }, { "id": 1688399312240, "text": "zxcxzczxc" }] }, { "id": "70c8ce02-e1a7-4b3b-879c-87fa4030abfe", "type": "title", "title": "Title", "content": "Title" }, { "id": "e73824ac-3758-46a4-b05d-1f1b7a25b7bc", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "<p>uihiasdhiaud</p>" }, { "id": 2, "text": "<p>s Ipsum è un testo segnaposto utilizzato nel settore</p>" }, { "id": 1687337545684, "text": "fgdfgdf" }] }, { "id": "cb6c5291-e392-4670-8ba9-b7a6eaf55308", "type": "title", "title": "Title", "content": "<p>Brand Book</p>" }, { "id": "42135a59-8c5c-426f-9250-a67c9fd1b79e", "type": "elenco", "title": "Elenco", "content": [{ "id": 2, "text": "<p><strong>Definizione</strong> ed <em>elaborazione</em> Manuale del logo e linee guida del marchio (versioni, colori principali, applicazioni, usi impropri, ecc..)</p>" }, { "id": 1, "text": "Definizione ed elaborazione della grafica coordinata con proposte layout grafici di stampa (insegne, bdv, brochure, folder, ecc...)" }] }, {
      "id": "59354cd2-f151-4980-b425-7d0c62c16b6f", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, { "id": "dbfcb9f3-9c7e-4fcf-94c3-4131b5e1c6c3", "type": "title", "title": "Title", "content": "<p>Registrazione marchio</p>" }, { "id": "38c824b2-1a73-4167-a414-246ea1b346c2", "type": "elenco", "title": "Elenco", "content": [{ "id": 1, "text": "Attività di ricerca anteriorità e/o marchi affini per evitare contenziosi." }, { "id": 2, "text": "Registrazione del marchio \"ELLEDI\" a livello nazionale N°02 varianti (a colori e bianco e nero) su 1 classe di Nizza." }] }, {
      "id": "cdd8c423-d0de-4565-8678-736ed6ef6f3e", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, { "id": "b1c5687b-782e-4240-860c-bdd911ed6fd8", "type": "paragrafo", "title": "Paragrafo", "content": "<p>Classi di Nizza ulteriori:&nbsp;</p>" }, {
      "id": "0876ef66-0dd9-467e-89ac-af2dffa5d9b1", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }, {
      "id": "3426fb61-3eaa-4542-9aac-a95089015a62", "type": "totale", "title": "Totale", "content": {
        title: "Totale",
        prezzo: "4500",
        ivainclusa: "false",
        info: "(valido per 10 anni)"
      }
    }]
  }, "pageInfo": { "companyLogo": "", "companyName": "<p>ELLEDI srl</p>", "companyAddress": "<p>Via Padergnone, 27 24050 Grassobbio (BG)</p>", "companyPiva": "IT01610020164", "contactPerson": "ALBERTO LUPINI", "agencyWebsite": "www.swi.it", "agencyName": "SWI Agency", "agencyAddress": "Viale Duca d'Aosta, 16 21052 Busto Arsizio (VA)", "agencyTel": "Tel. 0331 320873", "agencyFax": "Fax. 0331 636278", "agencyEmail": "Mail info@swi.it", "preventivoDate": "<p>22 Maggio 2023</p>", "preventivoTitle": "PREVENTIVO", "preventivoSubitle": "per fornitura servizi", "preventivoMessage": "Con riferimento alla Vs. richiesta, ringraziandoVi della preferenza abbiamo il piacere di formularvi la seguente proposta:" }
}

const PreventivoModal = ({ preventivo, clients, categories, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (formData) => {
    let slug;
    let data;
    if (formData.id) {
      slug = formData.slug;
      data = formData.data;
    } else {
      data = defaulData;
      slug = uuidv4();
    }
    const newPreventivo = {
      ...formData,
      slug,
      data,
    };
    onSave(newPreventivo);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <label htmlFor="createEdit" onClick={handleOpen} className={`${preventivo ? 'm1 cursor-pointer' : 'btn m-1 btn-xs btn-success text-white'}`}>{preventivo ? '🛠' : '🤑 Nuovo Preventivo'}</label>
      {isOpen && (
        <>
          <input type="checkbox" id="createEdit" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <PreventivoForm
                preventivo={preventivo}
                clients={clients}
                categories={categories}
                onSave={handleSave}
                onClose={handleClose}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PreventivoModal;
