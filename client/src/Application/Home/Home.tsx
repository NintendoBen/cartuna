import { useApolloClient, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { animated, config, useTransition } from "react-spring";

import CardList from "./CardList/CardList";
import SeriesCard from "./SeriesCard/SeriesCard";
import Input from "./Input/Input";

import cartunaLogo from "./images/cartuna192.png";
import { GET_SERIES_BY_NAME } from "./HomeQueries";
import { SeriesSearch } from "./HomeTypes";
import Spinner from "../Spinner/Spinner";
import useRoute from "../../Router/useRoute";
import "./Home.css";
import RouteTransition from "Application/RouteTransition/RouteTransition";

type DataObject = { getSeriesByName: [SeriesSearch] };
type DataMap = Record<string, DataObject>;

const INPUT_DEBOUNCE = 500;

const queryCache: DataMap = {};

function Home() {
  const apolloClient = useApolloClient();

  const mounted = useRef(false);
  const route = useRoute("/:term");
  const term = route?.params.term || "";

  const [input, setInput] = useState("");
  const inputOnChangeHandler = useCallback((value) => {
    setInput(value);
  }, []);

  const [cards, setCards] = useState<Array<string>>([]);

  const { data, loading, variables } = useQuery(GET_SERIES_BY_NAME, {
    variables: { name: term, skip: !term },
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    route?.pushState(null, "", `/${input}`);

    //TODO: Figure out if we can improve our hooks usage...
    // eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    if (!term) return;

    queryCache[variables.name] = data;

    setCards([term]);

    //TODO: Figure out if we can improve our hooks usage...
    // eslint-disable-next-line
  }, [data]);

  const transitions = useTransition(cards, null, {
    from: { opacity: 1, transform: "rotateX(-30deg)" },
    enter: { delay: 0, opacity: 1, transform: "rotateX(0deg)" },
    leave: { opacity: 0, transform: "rotateX(30deg)" },
    config: config.default,
  });

  // if (!route) return null;

  return (
    <RouteTransition path="/:term">
      {(route) => {
        return (
          <div className="Home">
            <div className="ApplicationHeader">
              <img alt="Cartuna Logo" src={cartunaLogo} />
              <div className="ApplicationInput">
                <div className="ApplicationTitle">Cartuna</div>
                <div className="InputContainer">
                  <div className="InputWrapper">
                    <Input
                      debounce={INPUT_DEBOUNCE}
                      defaultValue={term}
                      onChange={inputOnChangeHandler}
                    />
                  </div>
                  <div className="spinnerContainer">
                    <Spinner show={loading} />
                  </div>
                </div>
              </div>
            </div>
            <div className="HomeCardList">
              {transitions.reverse().map(({ item, key, props }) => (
                <animated.div key={key} className="CardListTest" style={props}>
                  <CardList>
                    {queryCache &&
                      queryCache[item] &&
                      queryCache[item] &&
                      queryCache[item].getSeriesByName &&
                      queryCache[
                        item
                      ].getSeriesByName.map((series: SeriesSearch) => (
                        <SeriesCard key={series.id} {...series} />
                      ))}
                  </CardList>
                </animated.div>
              ))}
            </div>
          </div>
        );
      }}
    </RouteTransition>
  );
}

export default Home;
