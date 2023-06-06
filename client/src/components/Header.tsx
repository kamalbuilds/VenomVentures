import {
  ActionIcon,
  Avatar,
  Button,
  Header as HeaderMantine,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ologo, thirdweb } from "../assets";
import Main from "../pages/Main";
import { VenomConnect } from "venom-connect";
import { initVenomConnect } from '../venom-connect/configure';
import { useEffect } from "react";

const Header = () => {

  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();

  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <HeaderMantine height={60} p="xs">
      <div className="flex">
        <div className="flex justify-center w-[170px]">
          <div>
            <img src={ologo} className="h-10 w-auto" />
          </div>
        </div>

        <div className="flex justify-between w-full">
          <TextInput
            rightSection={
              <ActionIcon>
                <IconSearch />
              </ActionIcon>
            }
            w={300}
            ml={100}
            placeholder="Search..."
            value={""}
            onChange={(e) => {}}
          />

          <div className="flex space-x-5 pr-5">
            <Main venomConnect={venomConnect} />

            <Link to="/profile">
              <Avatar src={null} alt="it's me" radius="xl" />
            </Link>
          </div>
        </div>
      </div>
    </HeaderMantine>
  );
};

export default Header;
