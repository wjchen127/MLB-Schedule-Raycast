import { Action, ActionPanel, Color, Icon, List, Detail } from "@raycast/api";
import { useState, useEffect } from "react";
import fetchFromYahooSports from "./utils/fetch";


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
    fetchFromYahooSports("")
    .then(games => {
        setGames(games)
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
    const length = detail.game_periods.length
    for(let i=0; i < length/9; i++){
        let scoreboard = "          "
        // let awayScore = 10
        // let homeScore = 11
        const isLastScoreBoard = (length - i*9) <= 9
        const end = isLastScoreBoard ? length : i*9+9
        if(true){
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
            scoreboard += "    " + detail.away + "   "
            for(let j=i*9+1; j <= end; j++){
                let awayScore = 0
                if(typeof detail.game_periods[j-1].away_points != "boolean"){
                    awayScore = detail.game_periods[j-1].away_points
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
            scoreboard += "    " + detail.home + "   "
            for(let j=i*9+1; j <= end; j++){
                let homeScore = 0
                if(typeof detail.game_periods[j-1].home_points != "boolean"){
                    homeScore = detail.game_periods[j-1].home_points
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
                    <List.Item title={`${item.detail.away} vs. ${item.detail.home}`} accessories={[{ tag: { value: item.status, color: chooseIconStyleByStatus(item.status) } },]}  detail={
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