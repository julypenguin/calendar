import { connect } from "react-redux"
import App from '../components/App.jsx'


const mapStateToProps = (state) => {
    const { intl } = state
    return {
        intl,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
