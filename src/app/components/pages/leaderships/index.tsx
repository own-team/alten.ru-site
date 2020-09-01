import React, { useEffect, useReducer } from 'react';
import { getAsyncData } from '../../../utils/async-get-data';
import { asyncDataReducer, initialState } from '../../../utils/async-data-states/reducer'
import { ERROR, FETCHED } from '../../../utils/async-data-states/types'
import Header from '../../blocks/header/header';
import LeadershipsItem from './items';

const LeadershipsComponent: React.FunctionComponent = () => {
    const [state, dispatch] = useReducer(asyncDataReducer, initialState)

    useEffect(() => {
        getAsyncData({ 
                api_v: 0, 
                url: 'articles', 
                params: {
                    'category': 'leaderships'
                }
            })
            .then(result => dispatch({ type: FETCHED, payload: { data: result } }))
            .catch(error => dispatch({ type: ERROR, payload: { errorString: error } }))
    }, [])

    return (
        <div className="content">
            {!state.loading &&
                <React.Fragment>
                    <Header title={state.data['category']['title']} subtitle={state.data['category']['descriptor']}/>
                    <div className="article">
                        <div className="list">
                            {
                                state.data['data'].map((item: {}, index: number) => {
                                    return (
                                        <LeadershipsItem key={index}
                                            id={item['id']}
                                            title={item['title']}
                                            subtitle={item['subtitle']}
                                            text={item['text']}
                                            image={{url: item['main_image']['image']}}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}

export default LeadershipsComponent;