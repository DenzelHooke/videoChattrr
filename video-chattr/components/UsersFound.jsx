import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingCircle from "./LoadingCircle";
import { uuid } from "uuidv4";

const UsersFound = ({ onAddFriend }) => {
  const { usersFound, isFriendsLoading, isResultsVisible } = useSelector(
    (state) => state.users
  );

  const { user } = useSelector((state) => state.auth);

  //   {isFriendsLoading ? (
  //     <LoadingCircle />
  //   ) : (
  //     usersFound.map((item) => {
  //       return (
  //         <>
  //           <div>{item.username}</div>
  //         </>
  //       );
  //     })
  //   )}
  return (
    <>
      {isResultsVisible && (
        <div id="friend-results" className="panel square">
          {isFriendsLoading ? (
            <LoadingCircle classes="small" />
          ) : usersFound.length < 1 ? (
            <>
              <p>No users found..</p>
            </>
          ) : (
            <>
              <ul>
                {usersFound.map((item) => {
                  console.log(item);
                  if (
                    item.username.toLowerCase() ===
                      user.username.toLowerCase() &&
                    usersFound.length === 1
                  ) {
                    return <p>No users found.</p>;
                  } else if (
                    item.username.toLowerCase() === user.username.toLowerCase()
                  ) {
                    return <></>;
                  }

                  return (
                    <>
                      <li className="user-result" key={uuid()}>
                        {item.username}
                        <button onClick={() => onAddFriend(item)}>
                          Add Friend
                        </button>
                      </li>
                    </>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default UsersFound;
