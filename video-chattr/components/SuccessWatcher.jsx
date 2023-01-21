import React from "react";

const SuccessWatcher = () => {
  const { isSuccess, message, push } = useSelector((state) => state.utils);
  // 5 seconds before err dissapears
  const duration = 5;
  const color = "";

  useEffect(() => {
    if (message && isError) {
      console.log(message);
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      if (push) {
        router.push(push);
      }
      // Reset error state.
      dispatch(resetError());
    }
  }, [message, isError]);
  return <div></div>;
};

export default SuccessWatcher;
