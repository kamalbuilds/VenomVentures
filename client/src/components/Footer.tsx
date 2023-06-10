import React from 'react';
interface FooterProps {
  twitterLink: string;
  discordLink: string;
}

const Footer: React.FC<FooterProps> = ({ twitterLink, discordLink }) => {
  return (
    <footer className="bg-#1C1C1C py-4">
      <div className="flex justify-center items-center">
        <a href={twitterLink} className="mr-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553" alt="Twitter" className="w-6 h-6" />
        </a>
        <a href={discordLink}>
          <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord" className="w-6 h-6" />
        </a>
      </div>
      <p className="text-white text-center mt-2">Made with Love by Ventures team</p>
    </footer>
  );
};

export default Footer;
