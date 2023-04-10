import { environment } from "@raycast/api";
import axios from "axios"
import { Team } from '../types/data_types'
const qs = require('qs')
const _ = require('lodash'); 
const tz = require('dayjs/plugin/timezone');
const dayjs = require('dayjs').extend(tz);



function convertUTCToLocalTime(utc: string){
    const time = dayjs(utc).format('YYYY-MM-DD HH:mm')
    return time
}
function today(){
    return dayjs().format('YYYY-MM-DD')
}

export default async function fetchFromYahooSports(tz: string){
    
    if(!tz){
        tz = dayjs.tz.guess()
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

        const result = _.map(scoreboard.games, ({ start_time, home_team_id, away_team_id, status_display_name, status_description, total_home_points, total_away_points, game_periods, away_team_stats, home_team_stats }) => ({
            
            detail: {      
                start_time: convertUTCToLocalTime(start_time),          
                home: teams[home_team_id][0],
                away: teams[away_team_id][0],
                game_periods: _.map(game_periods, ({ period_id, away_points, home_points }) => ({ inning: period_id, away_points: away_points, home_points: home_points })),
                stats: {
                    away_stats: _.map(away_team_stats, (obj) => _.get(obj, _.keys(obj)[0])),
                    home_stats: _.map(home_team_stats, (obj) => _.get(obj, _.keys(obj)[0])),
                },
            },
            inning: status_display_name,
            status: status_description,
            home_point: total_home_points,
            away_point: total_away_points,
            
            
        }))
        return result
    }).catch(error => {
        throw error
    })
    return games
}