import TopicGraph from './TopicGraph'

import data from "./data/topicGraph.json";

const App = () => {

    return (
        <TopicGraph
            data={data}
            width={1200}
            height={900}/>
    )
}

export default App;
