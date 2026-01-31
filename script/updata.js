const UpdataModal = document.getElementById("UpdataModal");
const closeBtn6 = document.getElementById("closeBtn6");

function closeUpdataModal()
{
	UpdataModal.style.display = "none";
}

closeBtn6.addEventListener("click",function() {
	closeUpdataModal();
});

window.addEventListener('click', function(event) {
    if (event.target === UpdataModal) {
		closeUpdataModal();
    }
});

function onTitleVerClick()
{
	UpdataModal.style.display = "block";
}