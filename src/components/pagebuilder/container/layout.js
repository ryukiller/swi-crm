import Image from "next/image";

const PageLayout = ({ children }) => {
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
          <h2 className="text-xs font-bold">ELLEDI Spa</h2>
          <p className="font-light text-xs mb-5">
            Via Padergnone, 27 24050 Grassobbio (BG) <br />
            P.iva IT01610020164
          </p>
          <p className="text-xs">alla C.A.</p>
          <p className="text-xs font-bold">ALBERTO LUPINI</p>
        </div>
        <div className="mymenu mt-8">
          <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
          <h3 className="font-bold uppercase text-lg">Dettaglio</h3>
          <p className="text-sm font-light">dei servizi offerti</p>
          <ul className="">
            <li className="my-10 group cursor-pointer hover:text-black text-xs text-black relative flex flex-row items-center justify-start">
              BRAND IDENTITY &<br /> BRAND PROTECTION
              <div className="absolute group-hover:bg-primary bg-primary right-[-55px] z-10 rounded-full p-2 border-2 border-white">
                <Image
                  src="/imgs/icon-1.png"
                  width="30"
                  height="30"
                  alt="Brand"
                />
              </div>
            </li>
            <li className="my-10 group cursor-pointer hover:text-black text-xs text-gray-500 relative flex flex-row items-center justify-start">
              SITO WEB: SVILUPPO &<br /> ASSISTENZA TECNICA
              <div className="absolute group-hover:bg-primary bg-gray-400 right-[-55px] z-10 rounded-full p-2 border-2 border-white">
                <Image
                  src="/imgs/icon-2.png"
                  width="30"
                  height="30"
                  alt="Brand"
                />
              </div>
            </li>
            <li className="my-10 group cursor-pointer hover:text-black text-xs text-gray-500 relative flex flex-row items-center justify-start">
              SEO
              <br /> Search Engine Optimization
              <div className="absolute group-hover:bg-primary bg-gray-400 right-[-55px] z-10 rounded-full p-2 border-2 border-white">
                <Image
                  src="/imgs/icon-3.png"
                  width="30"
                  height="30"
                  alt="Brand"
                />
              </div>
            </li>
            <li className="my-10 group cursor-pointer hover:text-black text-xs text-gray-500 relative flex flex-row items-center justify-start">
              SEM
              <br /> Search Engine Marketing
              <div className="absolute group-hover:bg-primary bg-gray-400 right-[-55px] z-10 rounded-full p-2 border-2 border-white">
                <Image
                  src="/imgs/icon-4.png"
                  width="30"
                  height="30"
                  alt="Brand"
                />
              </div>
            </li>
            <li className="my-10 group cursor-pointer hover:text-black text-xs text-gray-500 relative flex flex-row items-center justify-start">
              DEM
              <br /> Direct Email Marketing
              <div className="absolute group-hover:bg-primary bg-gray-400 right-[-55px] z-10 rounded-full p-2 border-2 border-white">
                <Image
                  src="/imgs/icon-5.png"
                  width="30"
                  height="30"
                  alt="Brand"
                />
              </div>
            </li>
            <li className="my-10 group cursor-pointer hover:text-black text-xs text-gray-500 relative flex flex-row items-center justify-start">
              SOCIAL
              <br /> NETWORK
              <div className="absolute group-hover:bg-primary bg-gray-400 right-[-55px] z-10 rounded-full p-2 border-2 border-white">
                <Image
                  src="/imgs/icon-6.png"
                  width="30"
                  height="30"
                  alt="Brand"
                />
              </div>
            </li>
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
            Mail info@siti-indicizzati.com
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
