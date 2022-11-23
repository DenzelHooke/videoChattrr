const RoomForm = ({
  onClick,
  modeState,
  setModeState,
  roomState,
  setRoomState,
  onRoomCheck,
}) => {
  const [formData, setFormData] = useState({
    roomID: "",
    isPublisher: true,
    isError: false,
    message: "",
  });

  const { roomID } = formData;

  const hasWhiteSpace = (s) => {
    if (s.indexOf(" ") >= 0) {
      return true;
    } else {
      return false;
    }
  };

  const onChange = (e) => {
    if (hasWhiteSpace(e.target.value)) {
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submmit click");

    //Reset local room state
    setRoomState({
      roomName: null,
      joinable: null,
      exists: null,
    });

    // Look for basic errors
    if (!roomID) {
      setFormData((prevState) => ({
        ...prevState,
        isError: true,
        message: "Please enter a room ID before continuing.",
      }));
      return;
    } else if (!modeState.buttonMode) {
      setFormData((prevState) => ({
        ...prevState,
        isError: true,
        message: "Please select a mode before continuing.",
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      isError: false,
      message: "",
    }));

    onClick({ roomName: roomID });
  };

  const onFormClick = (e) => {
    console.log("form click");

    //Check if create or join btn was pressed
    if (e.target.id === "create" || e.target.id === "join") {
      setModeState((prevState) => ({
        ...prevState,
        buttonMode: e.target.id,
      }));
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="form-control">
        <div className="item">
          <p className="space-text focus-text">
            {modeState.buttonMode === "create" ? "Room Name" : "Room ID"}
          </p>
          <input
            type="text"
            className={`${
              formData.isError
                ? "error_input form-input input"
                : "form-input input"
            }`}
            id="roomID"
            value={roomID}
            onChange={onChange}
            placeholder={
              modeState.buttonMode === "join"
                ? "Please enter a room ID"
                : "Please enter a room name"
            }
            maxLength="50"
          />
          <small>{formData.message}</small>
        </div>
        <div className="options item">
          {/* <div>
            {modeState.buttonMode === "create" ? (
              <>
                <label htmlFor="">Make this room joinable: </label>
                <input type="checkbox" id="joinable" className="checkbox" />
              </>
            ) : (
              modeState.buttonMode === "join" && <></>
            )}
          </div> */}
        </div>
        <div className="btn-wrapper item">
          <button
            id="create"
            type="button"
            className={`${
              modeState.buttonMode === "create"
                ? "btn_blue block-btn"
                : "btn_off block-btn"
            }`}
            onClick={onFormClick}
          >
            Create Mode
          </button>
          <button
            id="join"
            type="button"
            className={`${
              modeState.buttonMode === "join"
                ? "btn_blue block-btn"
                : "btn_off block-btn"
            }`}
            onClick={onFormClick}
          >
            Join Mode
          </button>
        </div>
        <div className="long-btn item">
          <button id="execute" type="submit" className="btn_blue">
            {modeState.buttonMode === null
              ? "Please select a mode"
              : modeState.buttonMode === "create"
              ? "Create Room"
              : modeState.buttonMode === "join" && "Join Room"}
          </button>
        </div>
        <div className="room-constrain" id="room-form-info"></div>
      </form>
    </>
  );
};

export default RoomForm;
