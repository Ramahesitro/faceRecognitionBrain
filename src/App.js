import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./Components/Navigation/Navigation";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Rank from "./Components/Rank/Rank";
import "./App.css";
import Clarifai from "clarifai";

// Instantiate a new Clarifai app by passing in your API key.
const app = new Clarifai.App({ apiKey: "0dd1f2ed0c0948a4b73a2976ce27ca33" });

const particlesOptions = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 200,
            },
        },
    },
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            imageUrl: "",
            box: {},
            route: "signIn",
            isSignedIn: false,
        };
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("inputImage");
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - clarifaiFace.right_col * width,
            bottowRow: height - clarifaiFace.bottom_row * height,
        };
    };

    displayFaceBox = (box) => {
        this.setState({ box: box });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        console.log("click");
        // Predict the contents of an image by passing in a URL.
        app.models
            .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then((response) => {
                console.log();
                this.displayFaceBox(this.calculateFaceLocation(response));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onRouteChange = (route) => {
        if (route === "signOut") {
            this.setState({ isSignedIn: false });
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    render() {
        const { isSignedIn, imageUrl, route, box } = this.state;
        return (
            <div className="App">
                <Particles className="particles" params={particlesOptions} />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
                {route === "home" ? (
                    <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                        <FaceRecognition box={box} imageUrl={imageUrl} />
                    </div>
                ) : route === "signIn" ? (
                    <SignIn onRouteChange={this.onRouteChange} />
                ) : (
                    <Register onRouteChange={this.onRouteChange} />
                )}
            </div>
        );
    }
}

export default App;
