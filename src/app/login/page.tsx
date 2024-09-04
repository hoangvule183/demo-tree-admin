"use client";

import { useLogin } from "@refinedev/core";
import loginBG from "/public/images/login-bg.webp";
import googleLogo from "/public/images/google-icon.png";
import Image from "next/image";

export default function Login() {
  const { mutate: login } = useLogin({});
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="w-screen h-screen bg-[white] flex flex-row">
        <div
          className="w-[55%] h-full relative shadow-xl"
          style={{
            borderRadius: "0px 5px 5px 0px",
            overflow: "hidden",
          }}
        >
          <Image
            src={loginBG.src}
            fill
            objectFit="cover"
            objectPosition="center"
            alt="login-bg"
          />
        </div>
        <div className="flex-1 flex flex-col items-start justify-start pt-[200px]">
          <div className="w-[70%] text-[2.5rem] font-bold mb-[40px] text-[#121212] ml-[15%]">
            Admin Page
          </div>
          <button
            className="text-[1.2rem] font-semibold py-[18px] px-[38px] 
                      flex items-center justify-center ml-[15%]
                      gap-[10px] outline-none rounded-md text-[#121212] 
                      bg-[white] border-solid boder-[1px]
                      hover:bg-[#121212] hover:text-[white] hover:shadow-lg hover:border-none
                      transition-all"
            onClick={() => login({})}
          >
            <Image
              src={googleLogo.src}
              width={25}
              height={25}
              alt="google-logo"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
