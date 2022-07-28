import React from "react"
import { io } from "socket.io-client"

export default function Chat(){

	React.useEffect(function(){
		const socket = io("ws://localhost:4000", {
			query: { some: "Some text" }
		})

		socket.on("new_message", function (socket){
			console.log("new msg")
		})
	},[])

	return (
		<div>
			Hello Chat
		</div>
	)
}