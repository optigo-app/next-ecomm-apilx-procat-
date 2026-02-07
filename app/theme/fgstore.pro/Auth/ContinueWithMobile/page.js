import MobileLogin from '.'

const page = ({params , searchParams ,storeInit}) => {
  return (
   <MobileLogin {...{params , searchParams ,storeInit}}/>
  )
}

export default page
