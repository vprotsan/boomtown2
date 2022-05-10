import styles from '../error/Error.module.scss';

export function Error(props) {

    return (
        <>
            {props.msg ? <h1 className={styles.errorHeader}> {props.msg} </h1> : ""}
            <img className={styles.errorImage} src={window.location.origin + '/images/taco-error.gif'}/>
        </>
    );
}