import { Image, Navbar as NavbarMantine, NavLink } from "@mantine/core";
import { To, useNavigate } from "react-router-dom";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLinkClick = (link: To) => {
    navigate(link);
  };

  return (
    <NavbarMantine
      width={{ base: 180 }}
      className="flex flex-col justify-between"
    >
      <div>
        <NavbarMantine.Section className="space-y-5 p-5">
          {navlinks.map((link) => (
            <div
              key={link.name}
              className="flex justify-center"
              onClick={() => handleLinkClick(link.link)}
            >
              <NavLink
                label={link.name}
                disabled={link.disabled}
                className="rounded-full capitalize"
                icon={<Image src={link.imgUrl} />}
              />
            </div>
          ))}
        </NavbarMantine.Section>
      </div>
    </NavbarMantine>
  );
};

export default Navbar;
