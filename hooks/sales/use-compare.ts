'use client'
import {useCallback,useEffect,useRef,useState} from 'react'
import {authClient} from '@/lib/auth-client'
import type {CompareActionResult} from '@/lib/compare/types'
const KEY='kn_compare', DEFAULT_MAX=4
const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string').slice(0,DEFAULT_MAX):[]}catch{return []}}
export function useCompare(){
 const {data:session,isPending}=authClient.useSession();const [compare,setCompare]=useState<string[]>([]);const [isLoading,setLoading]=useState(true);const [isSyncing,setSyncing]=useState(false);const merged=useRef(false)
 const commit=useCallback((ids:string[])=>{const next=[...new Set(ids)].slice(0,DEFAULT_MAX);setCompare(next);localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event('compare-change'));return next},[])
 useEffect(()=>{commit(read());setLoading(false)},[commit])
 const mergeAfterLogin=useCallback(async()=>{if(!session?.user||merged.current)return;setSyncing(true);try{const res=await fetch('/api/customer/compare/merge',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({productIds:read()})});if(res.status===401)return;const out=await res.json();if(res.ok&&out.success){commit(out.data.productIds);merged.current=true}}finally{setSyncing(false)}},[session?.user,commit])
 useEffect(()=>{if(!isPending&&session?.user&&!merged.current)void mergeAfterLogin();if(!session?.user)merged.current=false},[session?.user,isPending,mergeAfterLogin])
 const add=useCallback(async(id:string):Promise<CompareActionResult>=>{
  if(compare.includes(id))return{success:true,action:'none'}
  if(compare.length>=DEFAULT_MAX)return{success:false,action:'none',reason:'FULL'}
  const previous=compare;commit([...compare,id])
  if(session?.user){
   try{
    const r=await fetch('/api/customer/compare',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({productId:id})})
    if(!r.ok){commit(previous);return{success:false,action:'none',reason:r.status===409?'FULL':r.status===404?'UNAVAILABLE':'ERROR'}}
   }catch{commit(previous);return{success:false,action:'none',reason:'ERROR'}}
  }
  return{success:true,action:'added'}
 },[compare,session?.user,commit])
 const remove=useCallback(async(id:string)=>{const previous=compare;commit(compare.filter(x=>x!==id));if(session?.user)try{const r=await fetch(`/api/customer/compare/${encodeURIComponent(id)}`,{method:'DELETE'});if(!r.ok&&r.status!==401)commit(previous)}catch{commit(previous)}},[compare,session?.user,commit])
 const toggle=useCallback((id:string)=>compare.includes(id)?remove(id).then(()=>({success:true,action:'removed'} as CompareActionResult)):add(id),[compare,remove,add])
 const clear=useCallback(async()=>{const previous=compare;commit([]);if(session?.user)try{const r=await fetch('/api/customer/compare',{method:'DELETE'});if(!r.ok&&r.status!==401)commit(previous)}catch{commit(previous)}},[compare,session?.user,commit])
 const reorder=useCallback(async(ids:string[])=>{const previous=compare;commit(ids);if(session?.user)try{const r=await fetch('/api/customer/compare/reorder',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({productIds:ids})});if(!r.ok)commit(previous)}catch{commit(previous)}},[compare,session?.user,commit])
 return{compare,count:compare.length,maxItems:DEFAULT_MAX,isFull:compare.length>=DEFAULT_MAX,isLoading,isSyncing,add,remove,toggle,clear,has:(id:string)=>compare.includes(id),reorder,mergeAfterLogin}
}
