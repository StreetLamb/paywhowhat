import React, { Component } from 'react';
import './App.css';

// const list={
//   jerron:{
//     visits:[
//       {price:10, id:0}
//     ]
//   }
// };

class App extends Component {

  constructor(props){
    super(props);

    this.state={
      name:'',
      cost:'',
      results:{},
      index:0,
      final:{},
      pay:{},
    };

    this.onNameChange=this.onNameChange.bind(this);
    this.onCostChange=this.onCostChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
    this.setDetail=this.setDetail.bind(this);
    this.onDismiss=this.onDismiss.bind(this);
    this.getTotalEach=this.getTotalEach.bind(this);
    this.calculateFinal=this.calculateFinal.bind(this);
    this.findTop=this.findTop.bind(this);
    this.findPositive=this.findPositive.bind(this);
  }

  findTop(){
    const{pay}=this.state;
    var top='';

    Object.keys(pay).forEach(item=>{
      if(pay[item]>pay[top] || pay[top]==null){
        top=item;
      }
    })
    return top;
  }

  findPositive(){
    var positive=[];
    const {pay}= this.state;

    if(Object.keys(pay).length!==0){
      Object.keys(pay).forEach(item=>{
        if(pay[item]>0){
          positive.push(item);
        }
      })
    }
    return positive;
  }

  onDismiss(id,key){
    const {results}=this.state;
    const updatedResults = this.state.results[key].visits.filter(item=>item.id!==id);

    this.setState({
      results:{
        ...results,
        [key]:{visits:updatedResults}
      }
    },()=>this.getTotalEach());
  }

  setDetail(name,cost){
    const{results,index}=this.state;

    const oldVisits=results && results[name]
      ?results[name].visits
      :[]

    const updatedvisits=[
      ...oldVisits,
      {price:cost, id:index}
    ];

    this.setState({
      results:{
        ...results,
        [name]:{visits:updatedvisits}
      },
      index:index+1

    },()=>this.getTotalEach());

  }

  onSubmit(event){
    const {name,cost}=this.state;
    this.setDetail(name,cost);

    event.preventDefault();
  }

  onNameChange(event){
    this.setState({
      name:event.target.value,
    });
  }

  onCostChange(event){
    this.setState({
      cost:event.target.value,
    });
  }

  getTotalEach(){
    const{results,final}=this.state;
    var myfinal=final;

    Object.keys(results).forEach((key,index)=>{
      var finalprice=0;
      results[key].visits.forEach(item=>{
        finalprice+=Number(item.price);
      });
      if(finalprice===0 && results[key].visits.length===0){
        delete myfinal[key];
      }else{
        myfinal={
          ...myfinal,
          [key]:finalprice,
        }
       }
     })
     this.setState({final:myfinal},()=>this.calculateFinal()
     );
  }

  calculateFinal(){
    const {final}=this.state;
    var sum=0;
    var updatepay={};
    const count=Object.keys(final).length;
    Object.keys(final).forEach((key,index)=>{
      sum+=final[key];
    })

    const average=sum/count;
    Object.keys(final).forEach((key,index)=>{
      updatepay={...updatepay,[key]:final[key]-average};
    })
    this.setState({
      pay:updatepay
    });

  }

  render() {
    const {nameInput, costInput,results,pay}=this.state;
    return (
      <div className='page'>
        <div className='interactions'>
        <h1>Splitting bills made easy</h1>
          <DetailsInput
            nameInput={nameInput}
            costInput={costInput}
            onNameChange={this.onNameChange}
            onCostChange={this.onCostChange}
            onSubmit={this.onSubmit}
          >
            Add
          </DetailsInput>
          <FinalTable
           pay={pay}
           top={this.findTop}
           positive={this.findPositive}
          />
        </div>
        {results===null
          ?this.setState({results:{}})
          :<Table
            results={results}
            pay={pay}
            onDismiss={this.onDismiss}
           />
         }
      </div>
    );
  }
}

const Table=({results,onDismiss,pay})=>
    <div className='table'>
      {Object.keys(pay).length!==0 &&
        <div className='table-header'>
          <span style={{width:'33%'}}>
            Name
          </span>
          <span style={{width:'33%'}}>
          Paid
          </span>
          <span style={{width:'33%'}}>
          Delete
          </span>
        </div>
      }
      {
          Object.keys(results).map((key,index)=>
            results[key].visits.map(item=>
              <div key={item.id} className='table-row'>
                <span style={{width:'33%'}}>
                  {key}
                </span>
                <span style={{width:'33%'}}>
                  ${item.price}
                </span>
                <span style={{width:'33%'}}>
                  <Button
                    onClick={()=> onDismiss(item.id,key)}
                    className="button-inline"
                  >
                  Dismiss
                  </Button>
                </span>
              </div>

            )
          )
      }
    </div>

const Button=({onClick,className='',children})=>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const FinalTable=({pay,top,positive})=>

  <div className='table2'>
    {
      Object.keys(pay).map(item=>
        <div>
          <div>
            {
              item!==top()&& !positive().includes(item)&& pay[item]!==0&&
              <span style={{width:'50%'}}>{item.toUpperCase()} pays ${-pay[item].toFixed(2)} to {top().toUpperCase()}</span>
            }
          </div>

          <div>
            {
              item===top() && positive().filter(j=>j!==item).map(i=>
                <div>
                  <span style={{width:'50%'}}>{item.toUpperCase()} pays ${pay[i].toFixed(2)} to {i.toUpperCase()}</span>
                </div>
              )
            }
          </div>
        </div>
      )
    }
  </div>

const DetailsInput=({nameInput,costInput,onNameChange,onCostChange,onSubmit,children})=>
  <form onSubmit={onSubmit}>
      <input
        placeholder='Name'
        type='text'
        value={nameInput}
        onChange={onNameChange}
      />
      <input
        placeholder='Cost'
        type='number'
        step="0.01"
        value={costInput}
        onChange={onCostChange}
      />
      <button type='submit'>
        {children}
      </button>
  </form>

export default App;
