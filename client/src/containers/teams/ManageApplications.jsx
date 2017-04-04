import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router'
// import { LinkContainer } from 'react-router-bootstrap'
import { Button, ButtonToolbar, Modal, Table } from 'react-bootstrap'

import PlayerName from 'containers/players/PlayerName'
import { withPositions } from 'components/connectors/WithFixtures'
import { requestTeamApplications, tryAcceptApplication, cancelAcceptApplication,
    acceptApplication } from 'actions/teamEvents'
import { Loading, playerIsCaptain } from 'utils'


class ManageApplications extends Component {

    static propTypes = {
        team: PropTypes.object.isRequired,
        player: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.handleAcceptApplicationClick = this.handleAcceptApplicationClick.bind(this)
        this.handleAcceptCancelClick = this.handleAcceptCancelClick.bind(this)
        this.handleAcceptConfirmClick = this.handleAcceptConfirmClick.bind(this)
        this.handleRejectApplicationClick = this.handleRejectApplicationClick.bind(this)
    }

    componentDidMount() {
        const { requestTeamApplications, team: { id } } = this.props
        requestTeamApplications(id)
    }

    handleAcceptApplicationClick(applicationId) {
        const { tryAcceptApplication } = this.props
        tryAcceptApplication(applicationId)
    }

    handleAcceptCancelClick() {
        const { cancelAcceptApplication } = this.props
        cancelAcceptApplication()
    }

    handleAcceptConfirmClick() {
        const { acceptApplication, teamEvents: { applications: { items, confirmAccept } } } = this.props
        acceptApplication(confirmAccept, items[confirmAccept].team)
    }

    handleRejectApplicationClick() {
        // const { deleteTeam, team: { team: { id } } } = this.props
        // deleteTeam(id)
    }

    renderAcceptConfirmModal() {
        const { teamEvents: { applications: { items, confirmAccept } } } = this.props
        const application = confirmAccept ? items[confirmAccept] : null

        return (application &&
            <Modal show={Boolean(confirmAccept)}>
                <Modal.Header>
                    <Modal.Title>
                        Confirm Accept Application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to
                        accept <strong><PlayerName playerId={application.player} />'s</strong> application? This
                        cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='link' onClick={this.handleAcceptCancelClick}>Cancel</Button>
                    <Button bsStyle='success' onClick={this.handleAcceptConfirmClick}>Accept</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderApplicationsTable(applications) {
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Position applying for</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(application => (
                        <tr key={application.id}>
                            <td>
                                <Link to={`/players/${application.player}/`}>
                                    <PlayerName key={application.player} playerId={application.player} />
                                </Link>
                            </td>
                            <td>
                                {positions.items[application.position].name}
                            </td>
                            <td>
                                <ButtonToolbar>
                                    <Button bsSize='sm' bsStyle='success'
                                            disabled={!playerIsCaptain(player, team)}
                                            onClick={() => this.handleAcceptApplicationClick(application.id)}>
                                        Accept
                                    </Button>
                                    <Button bsSize='sm' bsStyle='danger'
                                            disabled={!playerIsCaptain(player, team)}
                                            onClick={() => this.handleRejectApplicationClick(application.id)}>
                                        Reject
                                    </Button>
                                </ButtonToolbar>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    render() {
        const { team, player,
            teamEvents: { applications: { items, isLoading, lastUpdated } },
            positions
        } = this.props

        const applications = Object.keys(items).map(
            applicationId => items[applicationId]
        ).filter(application => application.team === team.id)

        const pendingApplications = applications.filter(application => application.status === 1)
        const acceptedApplications = applications.filter(application => application.status === 2)
        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.renderAcceptConfirmModal()}
                            {this.renderApplicationsTable(pendingApplications)}
                        </div>
                    ) : <div>Error retrieving applications.</div>
                )}
            </div>
        )
    }
}

ManageApplications = withPositions(ManageApplications)
// ManageApplications = withPlayer(ManageApplications)
// ManageApplications = withTeam(props => props.params.id)(ManageApplications)
// ManageApplications = requireAuthentication(ManageApplications)
ManageApplications = connect(
    state => ({
        teamEvents: state.teamEvents
    }), {
        requestTeamApplications,
        tryAcceptApplication,
        cancelAcceptApplication,
        acceptApplication
    }
)(ManageApplications)

export default ManageApplications
