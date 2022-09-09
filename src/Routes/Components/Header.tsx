import styled from "styled-components";

const Nav = styled.nav``;

const Col = styled.div``;

function Header() {
    return <Nav>
        <Col>
            <Logo />
            <Items>
                <Item>Home</Item>
                <Item>TV Shows</Item>
            </Links>
        </Col>
        <Col>
            <button>Search</button>
        </Col>
    </Nav>>;
}

export default Header;
