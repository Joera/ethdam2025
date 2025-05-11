<script lang="ts">
    import { goto } from "$app/navigation";


    const handleAddGroup = () => {
    
        goto("/creategroup");
        
    }



</script>




<section id="groups_top"> 
    <h2>Groups</h2>
    <button id="add_group" on:click="{() => handleAddGroup()}">+</button>

</section>

<section id="groups_list">

    <ul>
        <li>
            <div>
                <h3>Stok2Vel</h3>
                <span>10</span>
                <span>10</span>
            </div>
            
        </li>
    </ul>

</section>




<style>

    #groups_top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-top: 3rem;
    }

    button#add_group {
        
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background: black;
    }

    #groups_list {

        position: relative;
        padding: 1rem 3rem; 
        width: 100%;

        ul {

            list-style: none;
            padding-left: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }

        li {
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #ccc;

            > div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
        }
    }


</style>
