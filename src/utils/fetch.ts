import { environment } from "@raycast/api";
import axios from "axios"
import { Team } from '../types/data_types'
import { today, convertUTCToLocalTime, guessTZ } from '../utils/utils'
const qs = require('qs')
const _ = require('lodash'); 


export default async function fetchFromYahooSports(tz: string){
    
    if(!tz){
        tz = guessTZ()
        console.log(tz)
    }

    const params ={
        lang: 'en-US',
        region: 'US',
        tz: tz,
        ysp_redesign: 1,
        ysp_platform: 'smartphone',
        leagues: 'mlb',
        date: today(),
        v: 2,
      };
    const games = await axios.get(`https://api-secure.sports.yahoo.com/v1/editorial/s/scoreboard?${qs.stringify(params)}`, {
        headers: {
            'User-Agent': `Raycast/${environment.raycastVersion}`
        }
    }).then(response => {
        const scoreboard = response.data.service.scoreboard
        const teams = _.fromPairs(_.map(scoreboard.teams, ({team_id, abbr, full_name}: Team) => ([ team_id, [abbr, full_name]])))

        const result = _.map(scoreboard.games, ({ start_time, home_team_id, away_team_id, status_description, total_home_points, total_away_points, game_periods, away_team_stats, home_team_stats, current_period_id, inning_status }) => ({
            
            detail: {      
                start_time: convertUTCToLocalTime(start_time),          
                home: teams[home_team_id][0],
                away: teams[away_team_id][0],
                game_periods: _.map(game_periods, ({ period_id, away_points, home_points }) => ({ current_inning: period_id, away_points: away_points, home_points: home_points })),
                stats: {
                    away_stats: _.map(away_team_stats, (obj) => _.get(obj, _.keys(obj)[0])),
                    home_stats: _.map(home_team_stats, (obj) => _.get(obj, _.keys(obj)[0])),
                },
                inning: current_period_id,
                inning_status: inning_status
            },
            status: status_description,
            home_point: total_home_points,
            away_point: total_away_points,
        }))

        //sorted by order
        const order = ["Live", "Pregame", "Final"]
        const sortedGames = _.orderBy(result, (o)=>{
            const index = _.indexOf(order, o.status)
            return index === -1 ? order.length : index
        })

        return {
            date: today(),
            games: sortedGames
        }
    }).catch(error => {
        throw error
    })
    return games
}