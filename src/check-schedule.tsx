import { Action, ActionPanel, Color, Icon, List, Detail, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import fetchFromYahooSports from "./utils/fetch";
import { today } from './utils/utils'

export default function Command() {

//   const [detailIndex, setDetailIndex] = useState(-1)
  const [games, setGames] = useState<Array<any>>([])

//   const markdown = `
//           1   2   3   4   5   6   7   8   9
//     BOS   n   n   n   n   n   n   n   n   n
//     NYY   n   n   n   n   n   n   n   n   n

//           10   11   12   13   14   15   R   H   E
//     BOS   n   n   n   n   n   n   k   k   k
//     NYY   n   n   n   n   n   n   k   k   k
// `;
  useEffect(()=>{
    // LocalStorage.removeItem("data")
    LocalStorage.getItem<string>("data")
    .then(s => {
        if(s && s.length > 0){
            try{
                const _data = JSON.parse(s)
                if(_data.date !== today()){
                    throw new Error("data is outdated.")
                }
                if(_data.games[0] && _data.games[0].status){
                    for(let i=0; i< _data.games.length; i++){
                        if(_data.games[i].status !== "Final"){
                            throw new Error("data is old.")
                        }
                    }
                    setGames(_data.games)
                }else{
                    throw new Error("data format is incorrect.")
                }
            }catch(err){
                throw err
            }   
        }else{
            throw new Error("data is empty.")
        }
        
    })
    .catch(err => {
        console.log("fetch data")
        console.log(err)
        fetchFromYahooSports("")
        .then(_data => {
            LocalStorage.setItem("data", JSON.stringify(_data))
            setGames(_data.games)
        })
    })
    
  },[])

  function chooseIconStyleByStatus(s: string){
    switch(s){
        case "Final":
            return Color.SecondaryText
        case "Live":
            return Color.Red
        default:
            return Color.Yellow
    }
  }

  function createScoreBoardMarkdown(detail){

    let markdown = ""
    const length = detail.game_periods.length <= 9 ? 9 : detail.game_periods.length
    for(let i=0; i < length/9; i++){
        let scoreboard = "          "
        // let awayScore = 10
        // let homeScore = 11
        const isLastScoreBoard = (length - i*9) <= 9
        const end = isLastScoreBoard ? length : i*9+9
        if(i == 0){
            scoreboard += " "
        }
        //last scoreboard
        for(let j=i*9+1; j <= end; j++){
            scoreboard = (j >= 10) ? (scoreboard + j + "  ") : (scoreboard + j + "   ")
        }
        if(isLastScoreBoard){
            if(i == 0){
                scoreboard += "R   H   E"
            }else{
                scoreboard += " R   H   E"
            }
            
        }

        scoreboard += "\n"
        scoreboard += "    " + (detail.away.length == 2 ? detail.away+" " : detail.away) + "   "
        for(let j=i*9+1; j <= end; j++){

            let awayScore
            // false "X" "4"
            if(j <= detail.inning){
                if(detail.game_periods[j-1].away_points){
                    awayScore = detail.game_periods[j-1].away_points
                }else{
                    awayScore = "_"
                }
            }else{
                awayScore = " "
            }

            scoreboard = (awayScore >= 10) ? (scoreboard = scoreboard + awayScore + "  ") : (scoreboard = scoreboard + " " + awayScore + "  ")       
        }
        if(isLastScoreBoard){
            // R H E
            detail.stats["away_stats"].forEach(digit => {
                scoreboard =  digit >= 10 ? scoreboard+digit : scoreboard+" "+digit
                scoreboard += "  "
            })
            
        }

        // home score
        scoreboard += "\n"
        scoreboard += "    " + (detail.home.length == 2 ? detail.home+" " : detail.home) + "   "
        for(let j=i*9+1; j <= end; j++){
            let homeScore
            if(j <= detail.inning){
                if(detail.game_periods[j-1].home_points){
                    homeScore = detail.game_periods[j-1].home_points
                }else{
                    homeScore = "_"
                }
                
            }else{
                homeScore = " "
            }

            scoreboard = (homeScore >= 10) ? (scoreboard = scoreboard + homeScore + "  ") : (scoreboard = scoreboard + " " + homeScore + "  ")
        }
        if(isLastScoreBoard){
            // R H E
            detail.stats["home_stats"].forEach(digit => {
                scoreboard =  digit >= 10 ? scoreboard+digit : scoreboard+" "+digit
                scoreboard += "  "
            })   
        }
        markdown = markdown + scoreboard + "\n\n"
    }
    return markdown
  }

  return (
    <>
      <List navigationTitle="MLB Schedule" isShowingDetail>
        <List.Section title="Today">
            { games.map((item, i) => {
                return (
                    <List.Item title={`${item.detail.away} vs. ${item.detail.home}`} keywords={[item.status]} accessories={[{ tag: { value: item.status, color: chooseIconStyleByStatus(item.status) } },]}  detail={
                        <List.Item.Detail markdown={createScoreBoardMarkdown(item.detail)} metadata={
                            <List.Item.Detail.Metadata>
                              <List.Item.Detail.Metadata.Label title="W. Pitcher" text="C.Sale (ERA. 2.56)" />
                              <List.Item.Detail.Metadata.Label title="L. Pitcher" text="N.Cortes (ERA. 3.5)"/>
                              <List.Item.Detail.Metadata.Label title="S. Pitcher" text="K.Jensen (ERA. 2.65)" />
                              <List.Item.Detail.Metadata.Separator />
                              <List.Item.Detail.Metadata.Label title="Abilities" />
                              <List.Item.Detail.Metadata.Label title="Chlorophyll" text="Main Series" />
                    
                              <List.Item.Detail.Metadata.Label title="Overgrow" text="Main Series" />
                        
                            </List.Item.Detail.Metadata>
                          }/>
                        
                      }  key={i}/>
                )
            }) }
        </List.Section>
        <List.Section title="Tomorrow">
        </List.Section>
        <List.Section title="April, 10th, 2023">
        </List.Section>
      </List>
    </>
  );
}