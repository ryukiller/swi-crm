import Image from "next/image";
import { useState } from "react";

const PageLayout = ({ children, columns, CurrentPage }) => {


  const [editableText, setEditableText] = useState({
    companyName: "ELLEDI Spa",
    companyAddress: "Via Padergnone, 27 24050 Grassobbio (BG)",
    companyPiva: "P.iva IT01610020164",
    contactPerson: "ALBERTO LUPINI",
    website: "www.swi.it",
    agencyName: "SWI Agency",
    agencyAddress: "Viale Duca d’Aosta, 16 21052 Busto Arsizio (VA)",
    agencyTel: "Tel. 0331 320873",
    agencyFax: "Fax. 0331 636278",
    agencyEmail: "Mail info@swi.it",
  });

  const handleEditableTextChange = (key, value) => {
    setEditableText((prevEditableText) => ({
      ...prevEditableText,
      [key]: value,
    }));
  };

  return (
    <div className="flex bg-white">
      <div className="w-3/12 bg-[#f3f3f3ff] flex flex-col align-middle p-8 justify-between">
        <div className="intenstazione">
          <Image
            src="/imgs/logo-elledi.png"
            width="80"
            height="80"
            alt="Logo Cliente"
            className="py-5"
          />
          <h2 className="text-xs font-bold" contentEditable="true" onChange={(e) =>
            handleEditableTextChange("companyName", e.target.value)
          } >
            {editableText.companyName}
          </h2>
          <p className="font-light text-xs mb-3" contentEditable="true" onChange={(e) =>
            handleEditableTextChange("companyAddress", e.target.value)
          }>
            {editableText.companyAddress}
          </p>
          <p className="font-light text-xs mb-5">
            <strong>PIVA: </strong>
            <span contentEditable="true" onChange={(e) =>
              handleEditableTextChange("companyPiva", e.target.value)
            }>{editableText.companyPiva}</span>
          </p>
          <p className="text-xs">alla C.A.</p>
          <p className="text-xs font-bold" contentEditable="true" onChange={(e) =>
            handleEditableTextChange("contactPerson", e.target.value)
          }>{editableText.contactPerson}</p>
        </div>
        <div className="mymenu mt-8">
          <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
          <h3 className="font-bold uppercase text-lg">Dettaglio</h3>
          <p className="text-sm font-light">dei servizi offerti</p>
          <ul className="">
            {columns.pages.map((page) => {
              let imgsrc = "/imgs/icon-1.png"

              switch (page.id) {
                case "1":
                  imgsrc = "/imgs/icon-1.png"
                  break;
                case "2":
                  imgsrc = "/imgs/icon-2.png"
                  break;
                case "3":
                  imgsrc = "/imgs/icon-3.png"
                  break;
                case "4":
                  imgsrc = "/imgs/icon-4.png"
                  break;
                case "5":
                  imgsrc = "/imgs/icon-5.png"
                  break;
                case "6":
                  imgsrc = "/imgs/icon-6.png"
                  break;
                default:
                  imgsrc = "/imgs/icon-1.png"

              }

              return (
                page.state && (
                  <li className={`my-10 group cursor-pointer hover:text-black text-xs ${CurrentPage === page.id ? 'text-black' : 'text-gray-500'} relative flex flex-row items-center justify-start`}>
                    {page.title}
                    <br />
                    {page.subtitle}
                    <div className={`absolute group-hover:bg-primary ${CurrentPage === page.id ? 'bg-primary' : 'bg-gray-400'} right-[-55px] z-10 rounded-full p-2 border-2 border-white`}>
                      <Image
                        src={imgsrc}
                        width="30"
                        height="30"
                        alt="Brand"
                      />
                    </div>
                  </li>
                )

              )
            })}
          </ul>
        </div>
        <div className="info-footer">
          <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
          <h3 className="uppercase text-lg font-bold">Contatti</h3>
          <p className="text-sm font-light">www.swi.it</p>
          <h4 className="font-bold text-xs mt-5">SWI Agency</h4>
          <p className="font-light text-xs mb-5">
            Viale Duca d’Aosta, 16 21052 Busto Arsizio (VA) <br />
            Tel. 0331 320873
            <br />
            Fax. 0331 636278 <br />
            Mail info@swi.it
          </p>
          <Image
            src="/imgs/google-partners.png"
            width={140}
            height={80}
            alt="google parter"
          />
          <Image
            src="/imgs/accounts.png"
            width={140}
            height={80}
            alt="google parter"
          />
        </div>
      </div>
      <div className="w-9/12 p-8">
        <div className="">
          <div className="w-full flex justify-end">
            <Image
              src="/imgs/logo-dark.png"
              width={100}
              height={80}
              alt="SWI Agency"
            />
          </div>
          <div>
            <div className="w-20 h-[2px] bg-primary my-2"></div>
            <h2 className="text-3xl font-bold text-primary tracking-widest uppercase">
              Preventivo
            </h2>
            <p className="text-lg text-secondary">per fornitura servizi</p>
            <div className="flex justify-end mt-[-10px] mb-8 font-light text-sm">
              <p>22 Maggio 2023</p>
            </div>
            <p className="text-sm font-light mb-12">
              Con riferimento alla Vs. richiesta, ringraziandoVi della
              preferenza abbiamo il piacere di formularvi la seguente proposta:
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
