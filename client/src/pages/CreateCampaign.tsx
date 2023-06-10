// @ts-nocheck
import { Alert, Container, Grid, Paper, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import DateForm from "../components/DateForm";
import Form, { FormProps, FORM_ERROR } from "../components/Form";
import LabeledTextField from "../components/FormField";
import LabeledTextAreaField from "../components/TextAreaForm";
import { NFTStorage, File } from 'nft.storage';
import {
  Address,
  ProviderRpcClient,
  Subscriber,
} from "everscale-inpage-provider";
import CollectionAbi from "../abi/Collection.abi.json";
import {COLLECTION_ADDRESS} from "../utils/constants";
import { useState } from "react";

export function CampaignForm<S extends z.ZodType<any, any>>(
  props: FormProps<S>
) {
  return (
    <Form<S> {...props}>
      <Container>
        <Paper shadow="sm" radius="md" p="xl" className="space-y-10">
          <Grid>
            <Grid.Col md={6}>
              <LabeledTextField
                name="name"
                label="Your Name"
                placeholder="write your name"
                required
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <LabeledTextField
                name="title"
                label="Campaign Title"
                placeholder="Write a Title"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <LabeledTextAreaField
                name="description"
                label="Information"
                placeholder="Give some information about your campaign"
                required
                minRows={5}
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <LabeledTextField
                name="target"
                label="Goal"
                placeholder="VENOM 0.005 "
                type="number"
                required
                precision={10}
                removeTrailingZeros
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <DateForm
                type="date"
                name="deadline"
                label="End Date"
                placeholder="Pick a date"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <LabeledTextField
                name="image"
                label="Campaign Image "
                placeholder="Place image url to represent your campaign"
                required
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Form>
  );
}

export const CreateCampaignValidation = z.object({
  name: z.string().min(4),
  title: z.string().min(4),
  description: z.string().min(4),
  target: z.number().min(0.0000001),
  deadline: z.date(),
  image: z.string().url(),
});

export type CreateCampaignValidationType = z.infer<
  typeof CreateCampaignValidation
>;

const CreateCampaign = (venomProvider : any, signeraddress : string) => {
  // call the createCampaign function here
  const navigate = useNavigate();

  // adding state to store the minted nft
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  
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
        attributes: data.properties.filter((e) => e.type.length > 0),
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

      const subscriber = new Subscriber(venomProvider);
      contract
        .events(subscriber)
        .filter((event : any) => event.event === "tokenCreated")
        .on(async (event : any) => {
          const { nft: nftAddress } = await contract.methods
            .nftAddress({ answerId: 0, id: id })
            .call();

            // const res = await fetch(`${BaseURL}/createnft`, {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({
            //     nft_address: nftAddress._address,
            //     tokenId: event.data.tokenId,
            //     collection_name: data.collection,
            //     json: nftjson,
            //     owner: signeraddress,
            //   }),
            // });

          console.log(res.data);
        });
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

  return (
    <div>
      <Title align="center" color="orange" order={1}>
        Start a Campaign
      </Title>
      <CampaignForm
        submitText="Submit new campaign"
        schema={CreateCampaignValidation}
        initialValues={{}}
        onSubmit={async (values) => {
          console.log(values,"v");
          try {
            // mint nft
            console.log(values,"vsdf");
            // mintnft(values);
          } catch (error: any) {
            console.error(error);
            showNotification({
              title: "Something went wrong",
              message: "Failed to create campaign",
              color: "red",
            });
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />
    </div>
  );
};

export default CreateCampaign;
