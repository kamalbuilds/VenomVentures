import { Grid, Loader, Title } from "@mantine/core";
import { ethers } from "ethers";
import DisplayCampaigns, {
  DisplayCampaignsProps,
} from "../components/DisplayCampaigns";

const Home = () => {
  const data = "";
  // data = get all the campaigns from the contract 

  return (
    <div>
      <Title align="center" mb={20}>
        All Campaigns
      </Title>

      {!data ? (
        <Loader />
      ) : (
        <Grid>
          {data.map((item: DisplayCampaignsProps, i: number) => {
            return (
              <DisplayCampaigns
                key={i}
                {...item}
                target={ethers.utils.formatEther(item.target.toString())}
                amountCollected={ethers.utils.formatEther(
                  item.amountCollected.toString()
                )}
                deadline={new Date(item.deadline.toNumber())}
              />
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default Home;
