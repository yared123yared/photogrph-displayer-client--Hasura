import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from '@apollo/react-hoc';
import { gql } from 'apollo-boost';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'


const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignIn extends React.Component {

    state = {
        displayOnLable: '',
        autorisedzUser: [],
        isAutorized: false,
        email: '',
        password: ''
    }

    componentDidMount = async () => {
        console.log("this is the submit button");
        const { loading, error, data } = await this.props.client.query({
            query: gql`
            
            query MyQuery {
                Photographer {
                  Email
                  Password
                }
              }
            `,

            variables: null,
        });



        if (error) {
            console.error(error);
            return (<div>
                Error : error.toString();
            </div>)
        }
        // console.log(data.Photographer);

        await this.setState({ autorisedzUser: data.Photographer });


    }
    Copyright = () => {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                    Your Website
          </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }
    addLoggedInUser = async (email) => {

        console.log("this is the submit button");
        const { loading, error, data } = await this.props.client.mutate({
            mutation: gql`
            mutation {
                insert_LoggedInPhotographer(objects: {
                    Email: "${email}"
                
                }) {
                  affected_rows
                  returning {
                    Id
                  }
                }
              }
              
   
            `,

            variables: null,
        })

        if (error) {
            console.error(error);
            return (<div>
                Error : error.toString();
            </div>)
        }


        console.log(data.Id);

    }
    handleLogin = () => {
        // console.log(this.state.autorisedzUser);
        const singleUser = this.state.autorisedzUser;
        // handle login method
        console.log("this is the autorized user came from the database", this.state.autorisedzUser);
        console.log("email: ", this.state.email);
        console.log("pasword", this.state.password);

        const user = {
            email: this.state.email,
            password: this.state.password
        }
        for (var index = 0; index < singleUser.length; index++) {

            if (user.email === singleUser[index].Email) {
                console.log("Email Match:", user.email);
                if (user.password === singleUser[index].Password) {
                    console.log("autorized user");
                    this.addLoggedInUser(user.email);
                    this.props.history.push('/home');

                    break;
                } else {

                    this.setState({ displayOnLable: 'Incorrect Password' });
                    console.log("incorrect password");
                    break;
                }
            } else {
                this.setState({ displayOnLable: 'Incorrect Email and Password' });
                console.log("incorrect email and passowrd");

            }

        };








        // if (this.state.autorisedzUser.includes(user)) {
        // console.log("Autorized used");
        // this.setState({ isAutorized: true });
        // }
        // else {
        // console.log("the user is not registered");
        // }

    }

    render() {
        const text = this.state.displayOnLable;
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
        </Typography>

                    <form className={classes.form} noValidate>
                        <div className=".text-danger">{text}</div>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onInput={e => this.setState({ email: e.target.value })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onInput={e => this.setState({ password: e.target.value })}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            onClick={this.handleLogin}
                            fullWidth
                            variant="contained"
                            color="primary"

                            className={classes.submit}
                        >
                            Sign In
          </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
              </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signUp" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>

                </Box>
            </Container>
        );
    }
}

export default withApollo(withStyles(useStyles)(SignIn))
