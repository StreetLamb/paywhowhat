//reset button doesnt work

import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';

/*
grape=#94618e
eggplant=#49274A
sand=#F4DECB
shell=#F8EEE7
*/
/*
terra=#945D60
herb=#626E60
chili=#AF473C
charcoal=#3c3c3c
*/
const initialState={
  name:'',
  cost:'',
  results:{},
  index:0,
  final:{},
  pay:{},
  gst:false,
  service:false,
};

const Table=({results,onDismiss,pay})=>
    <div className='table'>
      {Object.keys(pay).length!==0 &&
        <StyledTableDiv>
          <span style={{width:'33%'}}>
            Name
          </span>
          <span style={{width:'33%'}}>
          Paid
          </span>
          <span style={{width:'33%'}}>
          Delete
          </span>
        </StyledTableDiv>
      }
      {
          Object.keys(results).map((key,index)=>
            results[key].visits.map(item=>
              <StyledRowDiv>
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
              </StyledRowDiv>

            )
          )
      }
    </div>

const Button=({onClick,className='',children})=>
  <StyledButton
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </StyledButton>

const FinalTable=({pay,top,positive})=>

  <div>
    {
      Object.keys(pay).map(item=>
        <StyledFinalTableDiv>
          <div>
            {
              item!==top()&& !positive().includes(item)&& pay[item]!==0&&
              <span style={{width:'50%'}}>{item} > ${-pay[item].toFixed(2)} > {top()}</span>
            }
          </div>

          <div>
            {
              item===top() && positive().filter(j=>j!==item).map(i=>
                <div>
                  <span style={{width:'50%'}}>{item} > ${pay[i].toFixed(2)} > {i}</span>
                </div>
              )
            }
          </div>
        </StyledFinalTableDiv>
      )
    }
  </div>

const DetailsInput=({
  nameInput,
  costInput,
  onNameChange,
  onCostChange,
  onSubmit,
  children,
  onGSTChange,
  onServiceChange,
  ClearStorage,})=>
  <form onSubmit={onSubmit}>
      <Input
        required="required"
        placeholder='Name'
        type='text'
        value={nameInput}
        onChange={onNameChange}
      />
      <Input
        required="required"
        placeholder='Cost'
        type='number'
        step="0.01"
        value={costInput}
        onChange={onCostChange}
      />

      <StyledButton type='submit'>
        {children}
      </StyledButton>

      <Button
        onClick={ClearStorage}
      >
        Clear All
      </Button>

  </form>

const Input=styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: #49274A;
  background: #F4DECB;
  border: none;
  border-radius: 3px;
  font-size:1em;
`;
const H1=styled.h1`
  color: #F8EEE7;
  background: #626E60;
  padding: 0.5em;
  margin: 0.1em;
  font-size: 3em;
  font-family: Georgia, serif;
  font-weight:normal;
`
const StyledButton=styled.button`
  color: #F8EEE7;
  background: #626E60;
  margin: 0.5em;
  padding:0.5em;
`;
const StyledTableDiv=styled.div`
  display: flex;
  line-height: 24px;
  font-size: 1.5em;
  padding: 1em;
  justify-content: space-between;
  text-align: center;
  color: #626E60;
`;

const StyledFinalTableDiv=styled.div`
  margin: 1em;
  text-align: center;
  flex-flow: column || wrap;
  font-size: 20px;
  color: #626E60;
`;

const StyledRowDiv=StyledTableDiv.extend`
  background: #F4DECB;
  font-size: 1.5em;
  padding: 0em;
  align-items: center;
  color: #626E60;
  margin: 0.5em;
  border-radius: 5px;
`
const StyledPage=styled.div`
  background: #F8EEE7;
  border-radius: 5px;
  margin: 2em;
`

class App extends Component {

  constructor(props){
    super(props);

    this.state=initialState;

    this.onNameChange=this.onNameChange.bind(this);
    this.onCostChange=this.onCostChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
    this.setDetail=this.setDetail.bind(this);
    this.onDismiss=this.onDismiss.bind(this);
    this.getTotalEach=this.getTotalEach.bind(this);
    this.calculateFinal=this.calculateFinal.bind(this);
    this.findTop=this.findTop.bind(this);
    this.findPositive=this.findPositive.bind(this);
    this.onSetResult=this.onSetResult.bind(this);
    this.onGSTChange =this.onGSTChange.bind(this);
    this.onServiceChange=this.onServiceChange.bind(this);
    this.onClearStorage=this.onClearStorage.bind(this);
  }

  onSetResult=(results,key)=>{
    localStorage.setItem(key,JSON.stringify(results));
  }

  onClearStorage(){
    localStorage.clear();
    this.setState(initialState);
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
    },()=>{
      this.onSetResult(this.state.results,'myResults');
      this.getTotalEach();
    });
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

    },()=>{
      this.onSetResult(this.state.results,'myResults');
      this.getTotalEach();
    });
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

  onGSTChange(event){
    this.setState({
      gst:event.target.checked,
    },()=>this.calculateFinal())
  }

  onServiceChange(event){
    this.setState({
      service:event.target.checked,
    },()=>this.calculateFinal())
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
    const {final,gst,service}=this.state;
    const gst_price=gst?1.07:1;
    const service_price=service?1.10:1;
    var sum=0;
    var updatepay={};
    const count=Object.keys(final).length;
    Object.keys(final).forEach((key,index)=>{
      sum+=final[key];
    })

    const average=(sum*service_price)*gst_price/count;
    Object.keys(final).forEach((key,index)=>{
      updatepay={...updatepay,[key]:(final[key]*service_price)*gst_price-average};
    })
    this.setState({
      pay:updatepay
    });

  }

  componentWillMount(){
    document.title = "paywhowhat: Splitting bills made easy!"

    const cacheResults=localStorage.getItem('myResults');

    if(cacheResults){
      this.setState({
        results:JSON.parse(cacheResults)
      },()=>this.getTotalEach());
    }
  }

  render() {

    const {nameInput, costInput,results,pay}=this.state;
    return (
      <StyledPage>
        <div className='interactions'>
        <H1>Splitting Bills Made Easy</H1>
          <DetailsInput
            nameInput={nameInput}
            costInput={costInput}
            onNameChange={this.onNameChange}
            onCostChange={this.onCostChange}
            onSubmit={this.onSubmit}
            onGSTChange={this.onGSTChange}
            onServiceChange={this.onServiceChange}
            ClearStorage={this.onClearStorage}
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
      </StyledPage>
    );
  }
}

export default App;
