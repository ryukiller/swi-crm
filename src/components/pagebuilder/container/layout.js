'use client'
import { Eye, EyeOff, FileDown } from 'lucide-react'
import { useEffect, useState } from "react";

import EditableText from "./layout/EditableText";
import Image from "next/image";
import PreviewRenderer from "./PreviewRenderer";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import Upload from '@/components/Upload';


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

function removeHtmlTags(inputString) {
  return inputString.replace(/<.*?>/g, '');
}

function convertToSlug(inputString) {
  const cleanedString = removeHtmlTags(inputString).toLowerCase();
  const slug = cleanedString
    .normalize("NFD") // Normalize accented characters into their base form + diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters except whitespace and hyphens
    .trim()
    .replace(/[-\s]+/g, '-'); // Replace spaces and hyphens with a single hyphen
  return slug;
}

function getCurrentTimestamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(now.getFullYear()).slice(-2); // Extract the last two digits of the year
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const timestamp = `${day}-${month}-${year}-${hours}-${minutes}`;
  return timestamp;
}

const PageLayout = ({ children, columns, CurrentPage, editableText, textChange, userToken, liftIsPreview }) => {

  function resizeImageToDisplaySize(img, callback) {
    const fullImage = document.createElement('img');
    fullImage.src = img.src;
    fullImage.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Get the computed style of the image to account for padding/margin
      const style = window.getComputedStyle(img);
      const width = img.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = img.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

      // Maintain aspect ratio
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      let newWidth, newHeight;

      if (img.naturalWidth > img.naturalHeight) {
        // Image is wider than it is tall
        newWidth = width;
        newHeight = width / aspectRatio;
      } else {
        // Image is taller than it is wide
        newHeight = height;
        newWidth = height * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      const imageType = img.src.includes('.png') ? 'image/png' : 'image/jpeg';

      // If PNG, fill the canvas with a transparent background
      if (imageType === 'image/png') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(fullImage, 0, 0, newWidth, newHeight);

      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Failed to convert canvas to blob.');
          return;
        }
        const resizedImg = document.createElement('img');
        resizedImg.src = URL.createObjectURL(blob);
        resizedImg.onload = () => {
          callback(resizedImg);
        };
      }, imageType, 1); // Adjust quality as needed
    }
    fullImage.onerror = () => {
      console.error('Failed to load image:', img.src);
    };
  }



  function resizeAllImagesAndProceed() {
    const images = document.querySelectorAll('.canvaspage img');
    const resizePromises = Array.from(images).map(img => {
      return new Promise(resolve => {
        resizeImageToDisplaySize(img, resizedImg => {
          img.parentNode.replaceChild(resizedImg, img);
          resolve();
        });
      });
    });

    // When all images are resized, proceed to create the PDF
    Promise.all(resizePromises).then(() => {
      createPDF(); // Call your function to create the PDF
    });
  }




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
              element.classList.add("pb-[18px]")
              element.classList.add("pt-[0px]")

            });
            const textSmClass = el.querySelectorAll('.text-sm');
            textSmClass.forEach(element => {
              // adjust styles or do whatever you want here
              element.classList.remove("text-sm")
              element.classList.add("text-lg")

            });

            const mybullet = el.querySelectorAll('.mybullet');
            mybullet.forEach(element => {
              // adjust styles or do whatever you want here
              //element.classList.remove("m-[10px]")
              element.classList.add("mb-[-10px]")

            });

            // const ulliClass = el.querySelectorAll('ul li');
            // textSmClass.forEach(element => {
            //   // adjust styles or do whatever you want here
            //   element.classList.add("pt-[0px]")

            // });
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
        const name = "preventivo-" + convertToSlug(editableText.companyName) + "-" + getCurrentTimestamp() + ".pdf"
        pdf.save(name);
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

  useEffect(() => {
    liftIsPreview(isPreview)
  }, [isPreview])



  const fileTypes = [".jpg", ".png", ".jpeg", ".webp"];
  const uploadDir = "loghi";
  const [editAvatar, setEditAvatar] = useState(false);

  const handleUploadComplete = (imagePath) => {

    handleEditableTextChange('companyLogo', imagePath);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-start gap-4 m-2 p-2 text-white">
        <div className="bg-slate-700 cursor-pointer rounded-md p-2" onClick={() => setIsPreview(!isPreview)}>{isPreview ? (<span className="flex flex-row items-center justify-center"><Eye className="mr-2" /> Preview is On</span>) : (<span className="flex flex-row items-center justify-center"><EyeOff className="mr-2" /> Preview is Off</span>)}</div>
        <button className="bg-slate-700 cursor-pointer rounded-md p-2" onClick={resizeAllImagesAndProceed} type="button">{isPreview ? (<span className="flex flex-row items-center justify-center"><FileDown className="mr-2" /> Scarica tutte le pagine</span>) : (<span className="flex flex-row items-center justify-center"><FileDown className="mr-2" /> Scarica questa pagina</span>)}</button>
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
                          src={editableText.companyLogo ?? "/imgs/logo-elledi.png"}
                          width="400"
                          height="400"
                          alt="Logo Cliente"
                          className="py-5 w-full"
                        />

                        <EditableText
                          className="text-lg font-bold"
                          tagType="h2"
                          initialText={editableText.companyName}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="companyName"
                        />

                        <EditableText
                          className="font-light text-lg mb-3"
                          tagType="p"
                          initialText={editableText.companyAddress}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="companyAddress"
                        />

                        <EditableText
                          className="font-light text-lg mb-5"
                          tagType="p"
                          initialText={editableText.companyPiva}
                          handleEditableTextChange={handleEditableTextChange}
                          textKey="companyPiva"
                          inside="PIVA: "
                        />

                        <p className="text-lg">alla C.A.</p>
                        <EditableText
                          className="text-lg font-bold"
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
                                  <li key={index} className={`my-10 group cursor-pointer hover:text-black text-lg ${columns.pages[item.id - 1].parents.includes(page.id) || item.id === page.id ? 'text-black' : 'text-gray-500'} relative flex flex-row items-center justify-start`}>
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
                        <h4 className="font-bold text-lg mt-5">SWI Agency</h4>
                        <p className="font-light text-lg mb-5">
                          Via Piave, 15/17, 20027 Rescaldina MI <br />
                          Tel. 0331 320873 <br />
                          Tel. 0331 636278
                          <br />
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
                      <h1 className="bg-primary text-white uppercase px-3 py-2 my-6 fixpadding text-xl">
                        {item.title}
                      </h1>
                      {item.items.map((preview, index) => <PreviewRenderer key={index} item={preview} />)}

                      {item.parents.map((parents, index) => (
                        <div key={index}>
                          <h1 className="bg-primary text-white uppercase px-3 py-2 my-6 fixpadding mt-10 text-xl">
                            {columns.pages[parents - 1].title}
                          </h1>
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
              <div className="form-control my-2">
                <div className="py-5" onClick={() => setEditAvatar(!editAvatar)}>
                  <Image
                    className="cursor-pointer border-transparent border hover:border-secondary w-full"
                    src={editableText.companyLogo}
                    alt="cliente image"
                    width="400"
                    height="400"
                  />
                </div>
                {editAvatar && (
                  <Upload
                    acceptedFileTypes={fileTypes}
                    uploadDirectory={uploadDir}
                    accessToken={userToken}
                    onUploadComplete={handleUploadComplete}
                  />
                )}
              </div>
              <EditableText
                className="text-lg font-bold"
                tagType="h2"
                initialText={editableText.companyName}
                handleEditableTextChange={handleEditableTextChange}
                textKey="companyName"
              />

              <EditableText
                className="font-light text-lg mb-3"
                tagType="p"
                initialText={editableText.companyAddress}
                handleEditableTextChange={handleEditableTextChange}
                textKey="companyAddress"
              />

              <EditableText
                className="font-light text-lg mb-5"
                tagType="p"
                initialText={editableText.companyPiva}
                handleEditableTextChange={handleEditableTextChange}
                textKey="companyPiva"
                inside="PIVA: "
              />

              <p className="text-lg">alla C.A.</p>
              <EditableText
                className="text-lg font-bold"
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
                        <li key={index} className={`my-10 group cursor-pointer hover:text-black text-lg ${columns.pages[CurrentPage - 1].parents.includes(page.id) || CurrentPage === page.id ? 'text-black' : 'text-gray-500'} relative flex flex-row items-center justify-start`}>
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
              <h4 className="font-bold text-lg mt-5">SWI Agency</h4>
              <p className="font-light text-lg mb-5">
                Via Piave, 15/17, 20027 Rescaldina MI <br />
                Tel. 0331 320873 <br />
                Tel. 0331 636278
                <br />
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
