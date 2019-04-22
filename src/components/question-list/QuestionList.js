import React, { Component } from 'react';

import store from '../../redux/store';
import { connect } from "react-redux";

import { updateCurrentItemId, updateCurrentType, updateNavState } from "../../redux/actions";

import { Question } from "../../components/";

import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const mapState = state => ({
    currentType: state.currentType,
    currentItemId: state.currentItemId,
    supplierQuestions: state.supplierQuestions,
    productQuestions: state.productQuestions,
    projectQuestions: state.projectQuestions,
    suppliersRisk: state.suppliersRisk,
    productsRisk: state.productsRisk,
    projectsRisk: state.projectsRisk,
    supplierResponses: state.supplierResponses, // Responses are objects, with supplier/product/project ids as keys.
    productResponses: state.productResponses,
    projectResponses: state.projectResponses
});

class QuestionList extends Component {
    handleBack = (event) => {
        store.dispatch(updateCurrentItemId({currentItemId: null}));
    }

    render() {
        if (this.props.currentType == null || this.props.currentItemId == null){
            return <div className={"question-list"}>Either the current list type (suppliers, products, projects) or the current id (supplier, product, project) have no value.</div>
        }

        let type = this.props.currentType;
        let itemId = this.props.currentItemId;

        // Get responses for the given 
        let responses = null;
        if (type === "suppliers"){
            responses = this.props.supplierResponses;
        } else if (type === "products"){
            responses = this.props.productResponses;
        } else if (type === "projects"){
            responses = this.props.projectResponses;
        }

        // Filter by the given item (supplier/product/project) id
        if (responses.hasOwnProperty(itemId)){
            responses = responses[itemId];
        }

        // Get the relevant questions and assign the relevant risk item
        let questions = null, riskVal = null;
        if (type === "suppliers"){
            questions = this.props.supplierQuestions;
            riskVal = this.props.suppliersRisk[itemId];
        } else if (type === "products"){
            questions = this.props.productQuestions;
            riskVal = this.props.productsRisk[itemId];
        } else if (type === "projects"){
            questions = this.props.projectQuestions;
            riskVal = this.props.projectsRisk[itemId];
        }

        if (questions < 1){
            return (
                <Typography>
                    Questions are not available for {type} at the moment.
                    <Link onClick={(e) => this.handleBack(e)} >
                        Back to {itemId}
                    </Link>
                </Typography>
            );
        }

        const rows = questions.map((question, i) => (
            <TableRow key={i}>
                <TableCell key={i}>
                    <Question key={i} question={question} response={responses[question.ID]}/>
                </TableCell>
            </TableRow>
        ));

        return (
            <div className="question-list">
                <Table className={this.props.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Link onClick={(e) => this.handleBack(e)} >
                                    {itemId}
                                </Link>
                                Questions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={true}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Current Risk: {riskVal}</span>}
                />
            </div>
        );
    }
}

export default connect(mapState)(QuestionList);