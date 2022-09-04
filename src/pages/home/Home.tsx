import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import "./home.css";

const Home = () => {
  const [playerDataHeaders, setPlayerDataHeaders] = useState<any>();
  const [playerObject, setPlayerObject] = useState<any>();
  const [searchPlayerText, setSearchPlayerText] = useState<string>("");
  const [searchTeamText, setSearchTeamText] = useState<string>("");
  const [searchPosText, setSearchPosText] = useState<string>("");
  const [searchByeText, setSearchByeText] = useState<string>("");
  const [updatedPlayerObject, setUpdatedPlayerObject] = useState<any>();
  const [loading, setLoading] = useState<any>(true);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    e.preventDefault();

    var files = e.target.files,
      f = files ? files[0] : null;
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target?.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = dataParse.shift();
      setPlayerDataHeaders(headers);
      let playerObject: any[] = [];

      dataParse.forEach((playerInfo: any, index: number) => {
        let checkboxEl = document.createElement('input');
        checkboxEl.type = 'checkbox'
        checkboxEl.id = `selection-${index + 1}`
        checkboxEl.value = `${index + 1}`
        checkboxEl.name = 'selectedPlayer'
        checkboxEl.setAttribute('onchange', 'handleSelect');
        const playerInfoObject = {
          id: (index + 1).toString(),
          name: playerInfo[0],
          team: playerInfo[1],
          pos: playerInfo[2],
          bye: playerInfo[3].toString(),
          checkBox: checkboxEl
        };
        console.log('player: ', playerInfoObject)
        playerObject.push(playerInfoObject);
      });
      setPlayerObject(playerObject);
      setUpdatedPlayerObject(playerObject);
      setLoading(false);
    };
    reader.readAsBinaryString(f as Blob);
  };

  const handlePlayerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPlayerText(e.target.value);
  };

  const handleTeamSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeamText(e.target.value);
  };

  const handlePosSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPosText(e.target.value);
  };

  const handleByeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchByeText(e.target.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e: ", e.target.checked);
    if (e.target.checked) {
      const playerEl = document.getElementById(`player-${e.target.value}`);
      if (playerEl) playerEl.style.textDecoration = "line-through";
      const teamEl = document.getElementById(`team-${e.target.value}`);
      if (teamEl) teamEl.style.textDecoration = "line-through";
      const posEl = document.getElementById(`pos-${e.target.value}`);
      if (posEl) posEl.style.textDecoration = "line-through";
      const byeEl = document.getElementById(`bye-${e.target.value}`);
      if (byeEl) byeEl.style.textDecoration = "line-through";
    } else {
        const playerEl = document.getElementById(`player-${e.target.value}`);
      if (playerEl) playerEl.style.textDecoration = "none";
      const teamEl = document.getElementById(`team-${e.target.value}`);
      if (teamEl) teamEl.style.textDecoration = "none";
      const posEl = document.getElementById(`pos-${e.target.value}`);
      if (posEl) posEl.style.textDecoration = "none";
      const byeEl = document.getElementById(`bye-${e.target.value}`);
      if (byeEl) byeEl.style.textDecoration = "none";
    }
  };

  useEffect(() => {
    if (loading === false && playerObject) {
      if (searchPlayerText === "") {
        setUpdatedPlayerObject(playerObject);
      }

      const filteredPlayerObject = playerObject.filter((player: any) =>
        player.name?.toLowerCase()?.includes(searchPlayerText.toLowerCase())
      );

      setUpdatedPlayerObject(filteredPlayerObject);
    }
  }, [searchPlayerText, loading, playerObject]);

  useEffect(() => {
    if (loading === false && playerObject) {
      if (searchTeamText === "") {
        setUpdatedPlayerObject(playerObject);
      }

      const filteredPlayerObject = playerObject.filter((player: any) =>
        player.team?.toLowerCase()?.includes(searchTeamText.toLowerCase())
      );

      setUpdatedPlayerObject(filteredPlayerObject);
    }
  }, [searchTeamText, loading, playerObject]);

  useEffect(() => {
    if (loading === false && playerObject) {
      if (searchPosText === "") {
        setUpdatedPlayerObject(playerObject);
      }

      const filteredPlayerObject = playerObject.filter((player: any) =>
        player.pos?.toLowerCase()?.includes(searchPosText.toLowerCase())
      );

      setUpdatedPlayerObject(filteredPlayerObject);
    }
  }, [searchPosText, loading, playerObject]);

  useEffect(() => {
    if (loading === false && playerObject) {
      if (searchByeText === "") {
        setUpdatedPlayerObject(playerObject);
      }

      const filteredPlayerObject = playerObject.filter((player: any) =>
        player.bye?.toLowerCase()?.includes(searchByeText.toLowerCase())
      );

      setUpdatedPlayerObject(filteredPlayerObject);
    }
  }, [searchByeText, loading, playerObject]);

  return (
    <>
      {loading ? (
        <input type="file" onChange={handleUpload} />
      ) : (
        <div className="box">
          <header>
            <input
              className="searchtext"
              type="text"
              placeholder="Search Player"
              name="searchPlayerText"
              onChange={handlePlayerSearch}
            ></input>
            <input
              className="searchtext"
              type="text"
              placeholder="Search Team"
              name="searchTeamText"
              onChange={handleTeamSearch}
            ></input>
            <input
              className="searchtext"
              type="text"
              placeholder="Search Pos"
              name="searchPosText"
              onChange={handlePosSearch}
            ></input>
            <input
              className="searchtext"
              type="text"
              placeholder="Search Bye"
              name="searchByeText"
              onChange={handleByeSearch}
            ></input>
          </header>
          <div className="fantasy-football-data">
            <div className="players-list">
              {playerDataHeaders.map((header: string, index: number) => {
                if (index === 0) {
                  return (
                    <div className="player-criteria">
                      <ul key={`${header}-${index}-list`}>
                        <span>{header}</span>
                        {updatedPlayerObject.map((player: any) => {
                          return (
                            <li id={`player-${player.id}`}>{player.name}</li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                } else if (index === 1) {
                  return (
                    <div className="player-criteria">
                      <ul key={`${header}-${index}-list`}>
                        <span>{header}</span>
                        {updatedPlayerObject.map((player: any) => {
                          return (
                            <li id={`team-${player.id}`}>{player.team}</li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                } else if (index === 2) {
                  return (
                    <div className="player-criteria">
                      <ul key={`${header}-${index}-list`}>
                        <span>{header}</span>
                        {updatedPlayerObject.map((player: any) => {
                          return <li id={`pos-${player.id}`}>{player.pos}</li>;
                        })}
                      </ul>
                    </div>
                  );
                } else {
                  return (
                    <div className="player-criteria">
                      <ul key={`${header}-${index}-list`}>
                        <span>{header}</span>
                        {updatedPlayerObject.map((player: any) => {
                          return <li id={`bye-${player.id}`}>{player.bye}</li>;
                        })}
                      </ul>
                    </div>
                  );
                }
              })}
              <div className="player-criteria">
                <ul>
                  <span>Drafted</span>
                  {updatedPlayerObject.map((player: any) => {
                    return (
                      <input
                        type="checkbox"
                        id={`selection-${player.id}`}
                        value={`${player.id}`}
                        name="selectedPlayer"
                        onChange={handleSelect}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="myTeam">
              <h1>My Team</h1>
              <div className="row">
                <p>Pos</p>
                <p>Player Name</p>
                <p>Team</p>
                <p>Bye Week</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
