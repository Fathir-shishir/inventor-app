import {Component} from 'react'
import moment from "moment-timezone";

 export class Clock extends Component{

    constructor(props){
        super(props)
        this.state = {
            date: new Date()
        }
        this.timer = null

        this.start ={
            date: new Date()
        }
    }

    componentDidMount(){
        this.timer = window.setInterval(()=>{
            this.setState({
                date: new Date()
            })
        })
    }

    componentWillUnmount(){
        window.clearInterval(this.timer)
    }

    render(){
        return <div className='clock'>

            {moment(this.state.date).format(moment.localeData().longDateFormat('LTS'))}

        </div>
    }
 }







