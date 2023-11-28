import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Image from "next/image";
import { useRouter } from "next/router";
//import Parse from "parse/dist/parse.min.js";

import ButtonLink from "components/ButtonLink";
import Carousel from "components/Hero/Carousel";
import PatternTile from "components/PatternTile";

import clsx from "helpers";

import { TSitesProps } from "types/ISitesProps";
import SphereViewer from "components/sphere";
const Hero = ({ sites }: { sites: TSitesProps }) => {
  // Your Parse initialization configuration goes here
  const PARSE_APPLICATION_ID = "tMHH8dq6zOL1pphhUnlB3tvk8f5t2PJ82MHfo3S5";

  const PARSE_HOST_URL = "https://parseapi.back4app.com/";
  const PARSE_JAVASCRIPT_KEY = "yHoqdGGLMdJuviGUQTJC5uPsqOKj6YCClf2PSF5z";
  // Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  // Parse.serverURL = PARSE_HOST_URL;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [t] = useTranslation();
  /*
 <p className="md:translate-x-[3vh] 4xl:-translate-x-[10vh] text-brownish text-base 3xl:text-3xl opacity-40 pb-2">
                  {site.title}
                </p>
                */
  const [isMobile, setIsMobile] = useState(false);
  /*
  const doUserRegistration = async function () {
    // Note that these values come from state variables that we've declared before
    const usernameValue = "newAdmin";
    const passwordValue = "admin";
    try {
      // Since the signUp method returns a Promise, we need to call it using await
      const createdUser = await Parse.User.signUp(usernameValue, passwordValue);
      alert(
        `Success! User ${createdUser.getUsername()} was successfully created!`
      );
      return true;
    } catch (error) {
      // signUp can fail if any parameter is blank or failed an uniqueness check on the server
      alert(`Error! ${error}`);
      return false;
    }
  };

  const doUserLogIn = async function (): Promise<boolean> {
    // Note that these values come from state variables that we've declared before
    const usernameValue: string = "admin";
    const passwordValue: string = "aaaaaa";
    try {
      const loggedInUser: Parse.User = await Parse.User.logIn(
        usernameValue,
        passwordValue
      );
      // logIn returns the corresponding ParseUser object
      alert(
        `Success! User ${loggedInUser.get(
          "username"
        )} has successfully signed in!`
      );
      // To verify that this is in fact the current user, `current` can be used
      const currentUser: Parse.User = await Parse.User.current();
      console.log(loggedInUser === currentUser);
      // Clear input fields

      return true;
    } catch (error: any) {
      // Error can be caused by wrong parameters or lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  */
  /*
  const readNavigations = async function (): Promise<boolean> {
    // Reading parse objects is done by using Parse.Query
    const parseQuery: Parse.Query = new Parse.Query("Navigation");
    try {
      let navigations: Parse.Object[] = await parseQuery.find();
      // Be aware that empty or invalid queries return as an empty array
      // Set results to state variable
      //  setReadResults(navigations);
      console.log("this is a navigation");
      console.log(navigations);
      return true;
    } catch (error: any) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };
*/
  useEffect(() => {
    // console.log("this is new console");
    //doUserLogIn();
    // readNavigations();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check on initial mount

    window.addEventListener("resize", handleResize);

    return () => {
      console.log("hello");
      console.log(sites[currentSlide]);
      console.log("image url :" + sites[currentSlide].image.url);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSlide]);

  const router = useRouter();

  return (
    <>
      {isMobile ? (
        <>
          <section
            className={`px-8 ${
              isMobile
                ? "max-h-[calc(calc(100vh-200px)-3rem)] md:max-h-[calc(calc(100vh-128px)-3rem)]"
                : "min-h-[calc(calc(100vh-200px)-3rem)] md:min-h-[calc(calc(100vh-128px)-3rem)]"
            }`}
          >
            <SphereViewer />
            <div
              className={clsx(
                "block md:flex max-2xl:gap-5 lg:gap-3 lg:px-12",
                isMobile && "flex-col"
              )}
            >
              <div className="order-1 md:order-2">
                <h2
                  className={
                    router.locale === "ar"
                      ? "text-5xl md:text-7xl 3xl:text-8xl 5xl:text-[180px] 6xl:text-[220px] font-semibold font-secondary "
                      : "text-2xl sm:text-3xl md:text-6xl 3xl:text-7xl 5xl:text-9xl 6xl:text-[180px] font-semibold font-secondary"
                  }
                >
                  {sites[currentSlide].title}
                </h2>
              </div>
              <div className="order-2 md:order-1 my-[2vh] ml-0 md:ml-[5vh] md:mr-[5vh]">
                <Carousel onSlideChanged={(_, curr) => setCurrentSlide(curr)}>
                  {sites.map((site) => (
                    <div key={site.id}>
                      <Image
                        width={411}
                        height={567}
                        className={clsx(
                          "items-center flex content-center mx-auto md:mx-[0vw] rounded-md pointer-events-none image-carousel h-[40vh] w-[calc(40vh*0.73)] 4xl:h-[800px] 4xl:min-w-[563px] 6xl:h-[1400px] 6xl:min-w-[986px]"
                        )}
                        alt={site.title}
                        src={site.image.url}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </section>
          <p
            className="scroll-auto text-xs sm:text-base font-normal md:text-lg 3xl:text-3xl 6xl:text-6xl text-brownish my-[2vh] min-h-[20vh]"
            style={{ color: "white", marginTop: "420px", textAlign: "center" }}
          >
            {sites[currentSlide].shortDescription}
          </p>
          <div
            className="bottom-[-9.25rem]"
            style={{
              color: "white",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <ButtonLink href={sites[currentSlide].link} text={t("visit")} />
          </div>
        </>
      ) : (
        <>
          <section className="px-8 min-h-[calc(calc(100vh-200px)-3rem)] md:min-h-[calc(calc(100vh-128px)-3rem)]">
            <SphereViewer />

            <div className="block md:flex max-2xl:gap-5 lg:gap-3 lg:px-12">
              <div className="pb-7">
                <PatternTile
                  numberOfTiles={6}
                  stroke="#000"
                  singleTileWidth={27}
                />
              </div>

              <div className="order-2 md:order-1 my-[2vh] mx-auto text-center">
                <h2
                  className={
                    (router.locale === "ar"
                      ? "text-3xl sm:text-4xl md:landscape:text-4xl lg:landscape:text-7xl 3xl:landscape:text-8xl 3xl:text-8xl 5xl:landscape:text-[180px] 6xl:landscape:text-[220px] font-semibold font-secondary "
                      : "text-2xl sm:text-3xl md:landscape::text-4xl lg:landscape::text-6xl 3xl:landscape::text-7xl 5xl:landscape:text-9xl 6xl:landscape:text-[180px] font-semibold font-secondary") +
                    " pt-2 pb-3"
                  }
                  style={{
                    color: "#F5EFDF",
                    marginLeft: "-150px",
                    marginTop: "-50px",
                  }}
                >
                  {sites[currentSlide].title}
                </h2>

                <Carousel onSlideChanged={(_, curr) => setCurrentSlide(curr)}>
                  {sites.map((site) => (
                    <div key={site.id}>
                      <Image
                        width={411}
                        height={567}
                        className={clsx(
                          "mx-auto lg:mx-[0vw] rounded-md pointer-events-none image-carousel h-[40vh] w-[calc(40vh*0.73)] sm:w-[362px] sm:h-[500px] sm:landscape:h-[60vh] sm:landscape:w-[calc(60vh*0.73)] 4xl:h-[800px] 4xl:min-w-[563px] 6xl:h-[1400px] 6xl:min-w-[986px]"
                        )}
                        alt={site.title}
                        src={site.image.url}
                        style={{ objectFit: "cover", borderRadius: "10%" }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </section>

          <p
            className="text-xs sm:text-base font-normal md:landscape:text-xs lg:landscape:text-lg 3xl:landscape:text-3xl 6xl:landscape:text-6xl text-brownish pt-0 pb-2 md:pb-1 min-h-[30vh]"
            style={{ color: "white", marginTop: "-60px", textAlign: "center" }}
          >
            {sites[currentSlide].shortDescription}
          </p>
          <div
            className="bottom-[-9.25rem]"
            style={{
              color: "white",
              marginTop: "-50px",
              textAlign: "center",
            }}
          >
            <ButtonLink href={sites[currentSlide].link} text={t("visit")} />
          </div>
        </>
      )}
    </>
  );
};

export default Hero;
