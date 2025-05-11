<script lang="ts">

import { clearSafeStore, findSrvByChain, parseSafeAddress, safe_addresses, safe_store } from '$lib/store/safe.store';
import { writable, type Writable } from 'svelte/store';
import { SafeService } from '$lib/safe.service';


    const handleCreateGroup = async () => {

        const name = "Stok2Vel";
        const symbol = "S2V";

        const srv = await findSrvByChain("gnosis");
        if (srv) {
            console.log("srv", srv);
            await srv.createGroup(name, symbol);
            console.log("done");
        }
    }



</script>

<h2>Create Group</h2>

<form>
    <input type="text" placeholder="Group Name">



    <button type="submit"  on:click="{() => handleCreateGroup()}">Create</button>
</form>

<style>

   form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
   }

</style>




