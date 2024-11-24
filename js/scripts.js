document.addEventListener('DOMContentLoaded', (event) => {
    let dragSrcEl = null;

    function handleDragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl !== this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }
        updateRanks();
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    function updateRanks() {
        // Gather all three lists and calculate cumulative ranks
        let allRanks = {};
        document.querySelectorAll('.ms-boxes').forEach((list, listIndex) => {
            list.querySelectorAll('.ms-box div[data-value="true"]').forEach((item, itemIndex) => {
                let key = item.textContent.trim(); // Unique identifier
                if (!allRanks[key]) {
                    allRanks[key] = 0;
                }
                allRanks[key] += itemIndex + 1; // Rank starts at 1
            });
        });

        let sortedRanks = Object.entries(allRanks).sort((a, b) => a[1] - b[1]);

        let resultInput = document.querySelector('input[data-input="drag-order"]');
        resultInput.value = sortedRanks.map(([key, rank]) => `${key}: ${rank}`).join(', ');

        let resultDiv = document.querySelector('.container .sorted-results');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.className = 'sorted-results';
            document.querySelector('.container').appendChild(resultDiv);
        }
        resultDiv.innerHTML = `<h2>Sorted Results:</h2>${sortedRanks.map(([key, rank]) => `<p>${key}: ${rank}</p>`).join('')}`;
    }

    let items = document.querySelectorAll('.ms-boxes .ms-box');
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });

    updateRanks();
});
