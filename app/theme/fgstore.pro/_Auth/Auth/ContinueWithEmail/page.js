import EmailLogin from '.'

const page = ({params , searchParams ,storeInit}) => {
  return (
   <EmailLogin {...{params , searchParams ,storeInit}}/>
  )
}

export default page
