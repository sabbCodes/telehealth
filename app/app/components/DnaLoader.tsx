"use client";

import { DNA } from "react-loader-spinner";

const DnaLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <DNA
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default DnaLoader;
