import { Loader, Grid, Alert, Title } from "@mantine/core";
import { ethers } from "ethers";
import DisplayCampaigns, {
  DisplayCampaignsProps,
} from "../components/DisplayCampaigns";

const Profile = () => {
  const data ="";
  const address="0xkam";
  // data = get all the campaigns

  if (!address) {
    return (
      <div>
        <Alert color="red">
          You need to connect your wallet to view thi profile page
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {!data ? (
        <Loader />
      ) : (
        <div>
          <Title align="center" mb={20}>My Campaigns</Title>
          {data.filter((item: DisplayCampaignsProps) => item.owner === address)
            .length === 0 && (
            <Alert color="red">You have not created any campaigns</Alert>
          )}
          <Grid>
            {data
              .filter((item: DisplayCampaignsProps) => item.owner === address)
              .map((item: DisplayCampaignsProps, i: number) => {
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
        </div>
      )}
    </div>
  );
};

export default Profile;
