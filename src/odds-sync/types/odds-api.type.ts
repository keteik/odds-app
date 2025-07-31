interface TheOddsApiBookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: TheOddsApiMarket[];
}

interface TheOddsApiMarket {
  key: string;
  last_update: string;
  outcomes: TheOddsApiOutcome[];
}

interface TheOddsApiOutcome {
  name: string;
  price: number;
}

export interface TheOddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: TheOddsApiBookmaker[];
}
