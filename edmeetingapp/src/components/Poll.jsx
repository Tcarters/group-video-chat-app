import React, { useContext, useEffect, useState } from "react";
import Modal from 'react-modal';
import { Line } from 'rc-progress';

import chatContext, { controlMessageEnum } from "./ChatContext";
import { PollContext } from "./PoolContext";
import styles from "./pollStyles";


const Poll = () => {
    const {question, setQuestion, answers: voteData, setAnswers, isModalOpen, setIsModalOpen } = useContext(PollContext);
    const { sendControlMessage }  = useContext(chatContext);
    const [totalVotes, setTotalVotes ] = useState(0);
    const [voted, setVoted] = useState(false);

    useEffect( () => {
        setTotalVotes(voteData.map( (item) => item.votes).reduce( (prev, next) => prev + next ))

    }, [voteData])

    const submitVote = (e, chosenAnswer ) => {
        if (!voted) {
            const newAnswers = voteData.map( newans => {
                if (chosenAnswer.option === newans.option) {
                    return { ...newans, votes: newans.votes + 1 }
                } else {
                    return newans;
                }
            });
            setAnswers(newAnswers);
            sendControlMessage(controlMessageEnum.initiatePoll, { question, answers: newAnswers });
            setTotalVotes( (prevTotalVotes) => prevTotalVotes + 1 );
            setVoted( (prevVoted) => !prevVoted);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setTotalVotes(0);
        setVoted(false);
        setQuestion('');
        setAnswers([
            { option: '', votes: 0},
            { option: '', votes: 0},
            { option: '', votes: 0},
            { option: '', votes: 0},
            { option: '', votes: 0}
        ]);
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            content="Poll Modal"
            style={styles.customStyles}
        >
            <div>
                <h1>{question}</h1>
                <div style={styles.flexColumn}>
                    {voteData && voteData.map( (ans, i) => !voted ? (
                        <button style={styles.button} 
                                key={i} 
                                onClick={ (e) => submitVote(e, ans) }
                        >
                            {ans.option}

                        </button>
                    ) : (
                        <div style={styles.flexCenter} key={i}>
                            <h2 style={styles.mr20}>
                                {ans.option}
                            </h2>
                            <Line percent={(ans.votes / totalVotes) * 100 }
                                strokeWidth="5" trailWidth="3"
                            />
                            <p style={styles.ml20}>{ans.votes} </p>

                            </div>
                    ) 
                    )}
                </div>
                <h3>Total Votes: {totalVotes} </h3>
            </div>

        </Modal>
    )
}

export default Poll;