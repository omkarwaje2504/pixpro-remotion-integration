const Banner = ({ bannerImage }) => {
  return (
    <div className="dark:bg-black dark:border-red-800 bg-white border-red-300 py-4 flex items-center justify-between border-b lg:w-[70%] ">
      <div className="flex items-center w-full h-full max-h-screen overflow-hidden relative">
        <img
          src={bannerImage ? bannerImage : "./banner.jpg"}
          alt="banner-image"
          className="w-full z-1"
        />
        <img
          src={bannerImage ? bannerImage : "./banner.jpg"}
          alt="banner-image"
          className="h-screen blur-3xl z-0 absolute hidden lg:block"
        />
      </div>
    </div>
  );
};

export default Banner;
