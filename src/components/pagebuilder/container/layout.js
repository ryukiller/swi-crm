import { Eye, EyeOff, FileDown } from 'lucide-react'
import { useEffect, useState } from "react";

import EditableText from "./layout/EditableText";
import Image from "next/image";
import PreviewRenderer from "./PreviewRenderer";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function getAllParents(obj, parents = []) {
  obj.forEach(item => {
    if (item.parents && item.parents.length > 0) {
      parents.push(...item.parents);
      const parentObjs = obj.filter(parentItem => item.parents.includes(parentItem.id));
      getAllParents(parentObjs, parents);
    }
  });
  return parents;
}

const PageLayout = ({ children, columns, CurrentPage, editableText, textChange }) => {

  const createPDF = async () => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const pages = document.querySelectorAll(".canvaspage");

    let count = 0;

    pages.forEach(async (page) => {

      const data = await html2canvas(page,
        { // options
          onclone: (el) => {
            const elementsWithShiftedDownwardText = el.querySelectorAll('.fixpadding');
            elementsWithShiftedDownwardText.forEach(element => {
              // adjust styles or do whatever you want here
              element.classList.remove("py-2")
              element.classList.add("pb-[16px]")
              element.classList.add("pt-[4px]")

            });
          }
        });
      const img = data.toDataURL("image/png");
      const imgProperties = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      if (count !== 0) {
        pdf.addPage();
      }
      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      count++
      if (count === pages.length) {
        pdf.save("shipping_label.pdf");
      }
    })

  };

  const handleEditableTextChange = (key, value) => {
    textChange((prevEditableText) => ({
      ...prevEditableText,
      [key]: value,
    }));
  };


  const [isPreview, setIsPreview] = useState(false);

  const allParents = getAllParents(columns.pages);

  return (
    <>
      <div className="flex flex-row items-center justify-start gap-4 m-2 p-2 text-white">
        <div className="bg-slate-700 cursor-pointer rounded-md p-2" onClick={() => setIsPreview(!isPreview)}>{isPreview ? (<span className="flex flex-row items-center justify-center"><Eye className="mr-2" /> Preview On</span>) : (<span className="flex flex-row items-center justify-center"><EyeOff className="mr-2" /> Preview Off</span>)}</div>
        <button className="bg-slate-700 cursor-pointer rounded-md p-2" onClick={createPDF} type="button">{isPreview ? (<span className="flex flex-row items-center justify-center"><FileDown className="mr-2" /> Scarica tutte le pagine</span>) : (<span className="flex flex-row items-center justify-center"><FileDown className="mr-2" /> Scarica questa pagina</span>)}</button>
      </div>
      {isPreview ? (

        <div id="pageBuilder" >
          {

            columns.pages
              .filter((item) => item.state !== false)
              .filter((item) => !allParents.includes(item.id))
              .map((item, index) => {
                console.log(item)
                return (
                  <div key={index} className="canvaspage flex bg-white w-[1240px] h-[1754px] my-10">
                    <div className="w-3/12 bg-[#f3f3f3ff] flex flex-col align-middle p-8 justify-between">
                      <div className="intenstazione">
                        <Image
                          src="/imgs/logo-elledi.png"
                          width="80"
                          height="80"
                          alt="Logo Cliente"
                          className="py-5"
                        />

                        <EditableText
                          className="text-xs font-bold"
                          tagType="h2"
                          initialText={editableText.companyName}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="companyName"
                        />

                        <EditableText
                          className="font-light text-xs mb-3"
                          tagType="p"
                          initialText={editableText.companyAddress}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="companyAddress"
                        />

                        <EditableText
                          className="font-light text-xs mb-5"
                          tagType="p"
                          initialText={editableText.companyPiva}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="companyPiva"
                          inside="PIVA: "
                        />

                        <p className="text-xs">alla C.A.</p>
                        <EditableText
                          className="text-xs font-bold"
                          tagType="p"
                          initialText={editableText.contactPerson}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="contactPerson"
                        />
                        <div className="mymenu mt-36">
                          <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
                          <h3 className="font-bold uppercase text-lg">Dettaglio</h3>
                          <p className="text-sm font-light">dei servizi offerti</p>
                          <ul className="">
                            {columns.pages.map((page, index) => {
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
                                  <li key={index} className={`my-10 group cursor-pointer hover:text-black text-xs ${columns.pages[item.id - 1].parents.includes(page.id) || item.id === page.id ? 'text-black' : 'text-gray-500'} relative flex flex-row items-center justify-start`}>
                                    {page.title}
                                    <br />
                                    {page.subtitle}
                                    <div className={`absolute group-hover:bg-primary ${columns.pages[item.id - 1].parents.includes(page.id) || item.id === page.id ? 'bg-primary' : 'bg-gray-400'} right-[-55px] z-10 rounded-full p-2 border-2 border-white`}>
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
                      </div>
                      <div className="info-footer">
                        <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
                        <h3 className="uppercase text-lg font-bold">Contatti</h3>
                        <p className="text-sm font-light">www.swi.it</p>
                        <h4 className="font-bold text-xs mt-5">SWI Agency</h4>
                        <p className="font-light text-xs mb-5">
                          Via Piave, 15/17, 20027 Rescaldina MI <br />
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
                          <EditableText
                            className="text-3xl font-bold text-primary tracking-widest uppercase"
                            tagType="h2"
                            initialText={editableText.preventivoTitle}
                            handleEditableTextChange={handleEditableTextChange}
                            textKey="preventivoTitle"
                          />

                          <EditableText
                            className="text-lg text-secondary"
                            tagType="p"
                            initialText={editableText.preventivoSubitle}
                            handleEditableTextChange={handleEditableTextChange}
                            textKey="preventivoSubitle"
                          />


                          <div className="flex justify-end mt-[-10px] mb-8 font-light text-sm">
                            <EditableText
                              className=""
                              tagType="p"
                              initialText={editableText.preventivoDate}
                              handleEditableTextChange={handleEditableTextChange}
                              textKey="preventivoDate"
                            />
                          </div>

                          <EditableText
                            className="text-sm font-light mb-12"
                            tagType="p"
                            initialText={editableText.preventivoMessage}
                            handleEditableTextChange={handleEditableTextChange}
                            textKey="preventivoMessage"
                          />
                        </div>
                      </div>
                      <div className="bg-primary text-white uppercase px-3 py-2 my-6 fixpadding">
                        {item.title}
                      </div>
                      {item.items.map((preview, index) => <PreviewRenderer key={index} item={preview} />)}

                      {item.parents.map((parents, index) => (
                        <div key={index}>
                          <div className="bg-primary text-white uppercase px-3 py-2 my-6 fixpadding mt-10">
                            {columns.pages[parents - 1].title}
                          </div>
                          {columns.pages[parents - 1].items.map((previewinner, index) => (
                            <PreviewRenderer key={index} item={previewinner} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
          }
        </div>

      ) : (
        <div id="pageBuilder" className="flex bg-white w-[1240px] h-[1754px] ">
          <div className="w-3/12 bg-[#f3f3f3ff] flex flex-col align-middle p-8 justify-between">
            <div className="intenstazione">
              <Image
                src="/imgs/logo-elledi.png"
                width="80"
                height="80"
                alt="Logo Cliente"
                className="py-5"
              />
              <EditableText
                className="text-xs font-bold"
                tagType="h2"
                initialText={editableText.companyName}
                handleEditableTextChange={handleEditableTextChange}
                textKey="companyName"
              />

              <EditableText
                className="font-light text-xs mb-3"
                tagType="p"
                initialText={editableText.companyAddress}
                handleEditableTextChange={handleEditableTextChange}
                textKey="companyAddress"
              />

              <EditableText
                className="font-light text-xs mb-5"
                tagType="p"
                initialText={editableText.companyPiva}
                handleEditableTextChange={handleEditableTextChange}
                textKey="companyPiva"
                inside="PIVA: "
              />

              <p className="text-xs">alla C.A.</p>
              <EditableText
                className="text-xs font-bold"
                tagType="p"
                initialText={editableText.contactPerson}
                handleEditableTextChange={handleEditableTextChange}
                textKey="contactPerson"
              />
              <div className="mymenu mt-36">
                <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
                <h3 className="font-bold uppercase text-lg">Dettaglio</h3>
                <p className="text-sm font-light">dei servizi offerti</p>
                <ul className="">
                  {columns.pages.map((page, index) => {
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
                        <li key={index} className={`my-10 group cursor-pointer hover:text-black text-xs ${columns.pages[CurrentPage - 1].parents.includes(page.id) || CurrentPage === page.id ? 'text-black' : 'text-gray-500'} relative flex flex-row items-center justify-start`}>
                          {page.title}
                          <br />
                          {page.subtitle}
                          <div className={`absolute group-hover:bg-primary ${columns.pages[CurrentPage - 1].parents.includes(page.id) || CurrentPage === page.id ? 'bg-primary' : 'bg-gray-400'} right-[-55px] z-10 rounded-full p-2 border-2 border-white`}>
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
            </div>
            <div className="info-footer">
              <div className="w-12 h-[2px] bg-primary my-2 ml-[-10px]"></div>
              <h3 className="uppercase text-lg font-bold">Contatti</h3>
              <p className="text-sm font-light">www.swi.it</p>
              <h4 className="font-bold text-xs mt-5">SWI Agency</h4>
              <p className="font-light text-xs mb-5">
                Via Piave, 15/17, 20027 Rescaldina MI <br />
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
                <EditableText
                  className="text-3xl font-bold text-primary tracking-widest uppercase"
                  tagType="h2"
                  initialText={editableText.preventivoTitle}
                  handleEditableTextChange={handleEditableTextChange}
                  textKey="preventivoTitle"
                />

                <EditableText
                  className="text-lg text-secondary"
                  tagType="p"
                  initialText={editableText.preventivoSubitle}
                  handleEditableTextChange={handleEditableTextChange}
                  textKey="preventivoSubitle"
                />


                <div className="flex justify-end mt-[-10px] mb-8 font-light text-sm">
                  <EditableText
                    className=""
                    tagType="p"
                    initialText={editableText.preventivoDate}
                    handleEditableTextChange={handleEditableTextChange}
                    textKey="preventivoDate"
                  />
                </div>

                <EditableText
                  className="text-sm font-light mb-12"
                  tagType="p"
                  initialText={editableText.preventivoMessage}
                  handleEditableTextChange={handleEditableTextChange}
                  textKey="preventivoMessage"
                />

              </div>
            </div>
            {children}
          </div>
        </div>
      )}


    </>
  );
};

export default PageLayout;
