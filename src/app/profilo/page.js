// pagina per modificare profilo utente
"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Upload from "../../components/Upload";
import Image from "next/image";

const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

function Profile({ user }) {
  const fileTypes = [".jpg", ".png", ".jpeg", ".webp"];
  const uploadDir = "avatars";
  

  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    options: {
      avatar: user.options?.avatar || "",
      descrizione: user.options?.descrizione || "",
    },
  });

  const handleUploadComplete = (imagePath) => {
    // Handle the image path, e.g., save it to the database
    const parsedPaths = JSON.parse(imagePath);
    //console.log('Image path:', parsedPaths.images[0]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      options: {
        ...prevFormData.options,
        avatar: parsedPaths.images[0],
      },
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/profilo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        reloadSession()
        
      } else {
        console.log("Failed to update user");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("options.")) {
      // Update nested property in options object
      const optionsProperty = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        options: {
          ...prevFormData.options,
          [optionsProperty]: value,
        },
      }));
    } else {
      // Update regular property
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const [editAvatar, setEditAvatar] = useState(true);

  return (
    <form
      className="hero-content flex-col items-start p-0"
      onSubmit={handleFormSubmit}
    >
      <div className="divider"></div>
      <div className="text-left">
        <h3 className="text-2xl font-bold">Modifica il tuo profilo</h3>
      </div>
      <div className="flex-shrink-0 w-full max-w-sm bg-base-100">
        <div className="form-control my-2">
          <label className="label">
            <span className="label-text">Avatar</span>
          </label>
          <div className="mb-5" onClick={() => setEditAvatar(!editAvatar)}>
              <Image
              className="cursor-pointer rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-secondary"
                src={formData.options.avatar}
                alt="profile image"
                width={60}
                height={60}
              />
              
            </div>
          {editAvatar ? (
            <><input
            type="hidden"
            name="options.avatar"
            value={formData.options.avatar}
          /></>
          ) : (
            <Upload
              acceptedFileTypes={fileTypes}
              uploadDirectory={uploadDir}
              accessToken={user.accessToken}
              onUploadComplete={handleUploadComplete}
            />
          )}
        </div>

        <div className="form-control my-2">
          <label className="label">
            <span className="label-text">Nome</span>
          </label>
          <input
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="input input-bordered"
          />
        </div>
        <div className="form-control my-2">
          <label className="label align-middle justify-start gap-2">
            <span className="label-text">Descrizione</span>
          </label>
          <textarea
            name="options.descrizione"
            className="textarea textarea-bordered"
            placeholder="Descrizione"
            value={formData.options.descrizione}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="form-control my-2 mt-6 flex flex-row gap-5 justify-between">
          <button type="submit" className="btn btn-success text-white btn-sm">
            Salva
          </button>
        </div>
      </div>
    </form>
  );
}

const Profilo = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/preventivi");
    },
  });

  return (
    <MainLayout>
      {session ? (
        <>
          <h1 className="text-5xl font-bold">
            Pagina profilo {session.user.name}
          </h1>
          <p className="py-6">
            Qui puoi modificare le impostazioni del tuo profilo.
          </p>
          <Profile user={session.user} />
        </>
      ) : (
        <div>loading...</div>
      )}
    </MainLayout>
  );
};

export default Profilo;
