import styles from './Alert.module.css'
export const Alert = ({children}: {children: React.ReactNode}) => {
  return (
    <div className={styles.alert}>
      {children}
    </div>
  )
}
