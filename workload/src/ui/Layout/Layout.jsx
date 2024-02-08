import React from "react";
import styles  from './Layout.module.scss'
const Layout = ({children}) => {
    return(
   
     <div className={styles.Layout}> 
    
        <div>{children}</div> 
        
     </div>
    )
}

export default Layout;