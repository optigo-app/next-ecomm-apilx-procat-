"use client";
import React from "react";

const test = ({ children }) => {
    const NestedArray = [1, 2, [11, 12, 13, [21, 22, 23, 2430, [31, 32, 33, 34, [46, { name: "test", age: 20 }]]]]];

    // const FlatArray = NestedArray.flat(Infinity);
    //  methods 1 with inbuilt methods
    // console.log(FlatArray , "1")

    // const FlattenArrRecursion = (NestedArray)=>{
    //     const FlatArray = [];
    //  for(let i=0;i<NestedArray.length;i++){
    //     if(Array.isArray(NestedArray[i])){
    //         FlatArray.push(...FlattenArrRecursion(NestedArray[i]));
    //     }else{
    //         FlatArray.push(NestedArray[i]);
    //     }
    //  }
    //  return FlatArray;
    // }

    // console.log(FlattenArrRecursion(NestedArray) , "2")

    // const FlattenArrReduce = arr=>arr.reduce((Acc,curr)=>Acc.concat(Array.isArray(curr) ? FlattenArrReduce(curr) : curr),[])

    // console.log(FlattenArrReduce(NestedArray) , "3")

    // const flat = arr => JSON.parse(`[${arr.toString()}]`);

    // console.log(flat(NestedArray) , "4")
    // console.log(JSON.parse(`[${NestedArray.toString()}]`))

    // const flattenObjects = arr =>
    //   JSON.parse(
    //     `[${JSON.stringify(arr)
    //       .replace(/\[|\]/g, '')
    //       .replace(/},{/g, '},{')
    //     }]`
    //   );

    // console.log(flattenObjects(NestedArray) , "5")

    return children;
};

export default test;