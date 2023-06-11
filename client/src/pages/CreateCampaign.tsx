// @ts-nocheck
import '../styles/main.css';
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";
import { Title } from "@mantine/core";
import { useForm } from "react-hook-form";
import { NFTStorage  } from "nft.storage";
import { useVenomWallet } from "../hooks/useVenomWallet";
import {COLLECTION_ADDRESS} from "../utils/constants";
import CollectionAbi from "../abi/Collection.abi.json";
import { Address } from "everscale-inpage-provider";
const CreateCampaignValidation = z.object({
  name: z.string().min(4),
  title: z.string().min(4),
  description: z.string().min(4),
  target: z.number().min(0.0000001),
  deadline: z.date(),
  image: z.string().url(),
});

const CreateCampaign = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formError, setFormError] = useState(null);
  const { venomProvider , address} = useVenomWallet();
  const signeraddress = address;
  const mintnft = async (data) => {
    try {
        // const BaseURL = "https://venomventures.vercel.app/api";
      const BaseURL = "http://localhost:3000/api";
      // @ts-ignore
      const nftstorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY })
      const ipfs_image =
        typeof data.image == "string"
          ? data.image
          : await nftstorage.store(data.image);

      const nftjson = JSON.stringify({
        type: "Basic NFT",
        id: 0,
        name: data.name,
        title: data.title,
        description: data.description,
        target: data.target,
        startdate: data.start,
        deadline: data.deadline,
        preview: {
          source: ipfs_image.replace(
            "ipfs://",
            "https://gateway.ipfscdn.io/ipfs/"
          ),
          mimetype: "image/png",
        },
        files: [
          {
            source: ipfs_image.replace(
              "ipfs://",
              "https://gateway.ipfscdn.io/ipfs/"
            ),
            mimetype: ipfs_image.replace(
              "ipfs://",
              "https://gateway.ipfscdn.io/ipfs/"
            ),
          },
        ],
        // attributes: data.properties.filter((e) => e.type.length > 0),
        external_url: "https://venomventures.vercel.app/",
        nft_image: ipfs_image,
        collection_name: data.collection,
      });
      
      const contract = new venomProvider.Contract(
        CollectionAbi,
        COLLECTION_ADDRESS
      );
      const { count: id } = await contract.methods
        .totalSupply({ answerId: 0 })
        .call();
      console.log({ id });

      // const subscriber = new Subscriber(venomProvider);
      // contract
      //   .events(subscriber)
      //   .filter((event : any) => event.event === "tokenCreated")
      //   .on(async (event : any) => {
      //     const { nft: nftAddress } = await contract.methods
      //       .nftAddress({ answerId: 0, id: id })
      //       .call();

      //       // const res = await fetch(`${BaseURL}/createnft`, {
      //       //   method: "POST",
      //       //   headers: {
      //       //     "Content-Type": "application/json",
      //       //   },
      //       //   body: JSON.stringify({
      //       //     nft_address: nftAddress._address,
      //       //     tokenId: event.data.tokenId,
      //       //     collection_name: data.collection,
      //       //     json: nftjson,
      //       //     owner: signeraddress,
      //       //   }),
      //       // });

      //     console.log(res.data);
        // });
      const outputs = await contract.methods.mintNft({ json: nftjson }).send({
        from: new Address(signeraddress),
        amount: "1000000000",
      });
      console.log(outputs,"creatred");
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }
  };

  const onSubmit = async (values) => {
    try {
      console.log(values,"value")
      const mint = await mintnft(values);
    } catch (error) {
      console.error(error);
      setFormError("Failed to create campaign");
      showNotification({
        title: "Something went wrong",
        message: "Failed to create campaign",
        color: "red",
      });
    }
  };

  return (
    <div>
      <Title align="center" color="orange" order={1}>
        Start a Campaign
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mx-auto">
          <div className="shadow-sm rounded-md p-8 space-y-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Write your name"
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <span className="text-red-500">Name is required</span>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-2 font-semibold">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Write a Title"
                    {...register("title", { required: true })}
                  />
                  {errors.title && (
                    <span className="text-red-500">Title is required</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 font-semibold">
                Information
              </label>
              <textarea
                id="description"
                placeholder="Give some information about your campaign"
                rows={5} className="w-full"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <span className="text-red-500">Description is required</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="start" className="block mb-2 font-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    placeholder="Pick a date"
                    {...register("start", { required: true })}
                  />
                  {errors.deadline && (
                    <span className="text-red-500">StartDate is required</span>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="deadline" className="block mb-2 font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    placeholder="Pick a date"
                    {...register("deadline", { required: true })}
                  />
                  {errors.deadline && (
                    <span className="text-red-500">Deadline is required</span>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="target" className="block mb-2 font-semibold">
                    Goal
                  </label>
                  <input
                    type="number"
                    id="target"
                    placeholder="VENOM 5"
                    {...register("target", { required: true })}
                  />
                  {errors.target && (
                    <span className="text-red-500">Target is required</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block mb-2 font-semibold">
                Campaign Image
              </label>
              <input
                type="text"
                id="image"
                placeholder="Place image url to represent your campaign"
                {...register("image", { required: true })}
              />
              {errors.image && (
                <span className="text-red-500">Image is required</span>
              )}
            </div>
            <div className="mb-4 text-center">
              <button type="submit" className="btn-primary bg-indigo-500 p-4 rounded-full">
                Submit new campaign
              </button>
            </div>
            {formError && (
              <Alert type="error" title="Something went wrong" description={formError} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;